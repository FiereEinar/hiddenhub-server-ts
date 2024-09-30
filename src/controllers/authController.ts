import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { validationResult } from 'express-validator';
import JsonResponse from '../models/response';
import User from '../models/user';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

type loginBody = {
	username: string;
	password: string;
};

export const login_get = asyncHandler(async (req: Request, res: Response) => {
	const { username, password }: loginBody = req.body;

	// check for body values errors
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		res.json(
			new JsonResponse(
				false,
				null,
				'Login body values error',
				errors.array()[0].msg
			)
		);
		return;
	}

	// check if the user exists
	const user = await User.findOne({ username: username }).exec();
	if (user === null) {
		res.json(new JsonResponse(false, null, 'Invalid username', ''));
		return;
	}

	// check if the passwords match
	const match = await bcrypt.compare(password, user.password);
	if (!match) {
		res.json(new JsonResponse(false, null, 'Invalid password', ''));
		return;
	}

	const secretKey = process.env.JWT_SECRET_KEY;
	if (secretKey === undefined) throw new Error('JWT Secret Key Not Found');

	// generate a token
	const token = jwt.sign({ username: user.username }, secretKey, {
		expiresIn: '1d',
	});

	// save the token on user
	user.refreshToken = token;
	await user.save();

	// send the token as cookie
	res.cookie('jwt_token', token, {
		secure: true,
		httpOnly: true,
		sameSite: 'none',
		maxAge: 1000 * 60 * 60 * 24,
	});

	res.json(new JsonResponse(true, null, 'Login successfull', ''));
});
