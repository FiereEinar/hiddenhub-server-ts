import asyncHandler from 'express-async-handler';
import { CustomRequest } from '../types/request';
import { Response } from 'express';
import JsonResponse from '../models/response';
import User from '../models/user';
import { forbiddenUserData } from '../constants';

/**
 * GET - fetch user data
 */
export const user_info_get = asyncHandler(
	async (req: CustomRequest, res: Response) => {
		const user = await User.findById(req.params.userID, forbiddenUserData);
		res.json(new JsonResponse(true, user, 'User data gathered', ''));
	}
);
