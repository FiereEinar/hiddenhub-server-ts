import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { validationResult } from 'express-validator';
import JsonResponse from '../models/response';
import User from '../models/user';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { loginBody, signupBody } from '../types/auth';
import { CustomRequest } from '../types/request';
import { cookieTokenName } from '../constants';

/**
 * POST - login
 */
export const login_post = asyncHandler(async (req: Request, res: Response) => {
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
	res.cookie(cookieTokenName, token, {
		secure: true,
		httpOnly: true,
		sameSite: 'none',
		maxAge: 1000 * 60 * 60 * 24,
	});

	res.json(new JsonResponse(true, null, 'Login successfull', ''));
});

/**
 * POST - Signup
 */
export const signun_post = asyncHandler(async (req: Request, res: Response) => {
	const { firstname, lastname, username, password }: signupBody = req.body;
	const defaultImgURL =
		'https://res.cloudinary.com/dkidfx99m/image/upload/v1719707237/uiotniwyo7xalhdurrf9.webp';
	const defaultImgID = 'zioyniwyo9xalhduarf1';

	// check for body validation errors
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		res.json(
			new JsonResponse(false, null, 'Validation error', errors.array()[0].msg)
		);
		return;
	}

	// check if a given username already exists
	const existingUsername = await User.findOne({ username: username }).exec();
	if (existingUsername !== null) {
		res.json(new JsonResponse(false, null, 'Username already exists', ''));
		return;
	}

	const salt = process.env.BCRYPT_SALT;
	if (salt === undefined) throw new Error('Bcrypt salt Not Found');

	// hash the password
	const hashedPassword = await bcrypt.hash(password, parseInt(salt));

	// create the user
	const user = new User({
		firstname,
		lastname,
		username,
		password: hashedPassword,
		profile: {
			url: defaultImgURL,
			publicID: defaultImgID,
		},
		cover: {
			url: '',
			publicID: '',
		},
	});

	await user.save();

	res.json(new JsonResponse(true, null, 'Signup successfull', ''));
});

export const logout = asyncHandler(
	async (req: CustomRequest, res: Response) => {
		const cookie = req.cookies;
		const token = cookie[cookieTokenName] as string;

		// check if the cookie exists
		if (!token) {
			res.sendStatus(204);
			return;
		}

		// check if a user exists with that token
		const user = await User.findOne({ refreshToken: token });
		if (user !== null) {
			user.refreshToken = '';
			await user.save();
		}

		// clear the cookie
		res.clearCookie(cookieTokenName, {
			secure: true,
			httpOnly: true,
			sameSite: 'none',
		});

		res.sendStatus(200);
	}
);
