import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import { CustomRequest } from '../types/request';
import { cookieTokenName } from '../constants';
import asyncHandler from 'express-async-handler';
import { jwtPayload } from '../types/auth';

const auth = asyncHandler(
	async (req: CustomRequest, res: Response, next: NextFunction) => {
		const cookie = req.cookies;

		// check if the cookie exists
		if (!cookie[cookieTokenName]) {
			res.sendStatus(401);
			return;
		}

		const token = cookie[cookieTokenName] as string;

		const secretKey = process.env.JWT_SECRET_KEY;
		if (secretKey === undefined) throw new Error('JWT Secret Key Not Found');

		// verify the token
		jwt.verify(token, secretKey, async (err, data) => {
			if (err) {
				res.sendStatus(403);
				return;
			}

			const payload = data as jwtPayload;
			const username = payload?.username;

			// check if the user exists
			const user = await User.findOne({ username: username }).exec();
			if (user === null) {
				res.sendStatus(403);
				return;
			}

			req.user = user;
			next();
		});
	}
);

export default auth;
