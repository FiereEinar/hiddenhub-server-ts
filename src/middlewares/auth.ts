import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import { CustomRequest } from '../types/request';

const auth = async (req: CustomRequest, res: Response, next: NextFunction) => {
	// check if the cookie exists
	if (!req.cookies?.jwt_token) {
		res.sendStatus(401);
		return;
	}

	const token = req.cookies.jwt_token as string;

	// check if a user exists with that token
	const user = await User.findOne({ refreshToken: token });
	if (user === null) {
		res.sendStatus(403);
		return;
	}

	const secretKey = process.env.JWT_SECRET_KEY;
	if (secretKey === undefined) throw new Error('JWT Secret Key Not Found');

	// verify the token
	jwt.verify(token, secretKey, (err, data) => {
		if (err) {
			res.sendStatus(403);
			return;
		}

		req.user = user;
		next();
	});
};

export default auth;
