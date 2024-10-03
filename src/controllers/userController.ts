import asyncHandler from 'express-async-handler';
import { CustomRequest } from '../types/request';
import { Response } from 'express';
import JsonResponse from '../models/response';
import User from '../models/user';
import { forbiddenUserData } from '../constants';
import { imageUploader } from '../utils/uploader';
import cloudinary from '../utils/cloudinary';
import { changePasswordBody } from '../types/user';
import bcrypt from 'bcryptjs';

/**
 * GET - fetch user data
 */
export const user_info_get = asyncHandler(
	async (req: CustomRequest, res: Response) => {
		const user = await User.findById(req.params.userID, forbiddenUserData);
		res.json(new JsonResponse(true, user, 'User data gathered', ''));
	}
);

/**
 * GET - fetch all users
 */
export const users_get = asyncHandler(async (req: CustomRequest, res) => {
	const users = await User.find({}, forbiddenUserData).exec();
	res.json(new JsonResponse(true, users, 'Users gathered', ''));
});

/**
 * PUT - update user cover photo
 */
export const user_cover_update = asyncHandler(
	async (req: CustomRequest, res) => {
		const userID = req.params.userID;

		const user = await User.findById(userID).exec();
		if (user === null) {
			res.json(new JsonResponse(false, null, 'User not found', ''));
			return;
		}

		let coverURL = user.cover.url;
		let coverPublicID = user.cover.publicID;

		if (req.file) {
			console.log('file exists');
			const result = await imageUploader(req.file);

			if (result !== undefined) {
				console.log('result exists');
				coverURL = result.secure_url;
				coverPublicID = result.public_id;
			}

			// if there was a previous cover, delete that from the cloud
			if (user.cover.publicID) {
				await cloudinary.uploader.destroy(user.cover.publicID);
			}
		}

		const update = {
			cover: {
				url: coverURL,
				publicID: coverPublicID,
			},
		};
		console.log('updating');

		const updatedUser = await User.findByIdAndUpdate(user._id, update, {
			new: true,
		}).exec();

		res.json(new JsonResponse(true, null, 'User cover photo updated', ''));
	}
);

/**
 * PUT - update user password
 */
export const user_password_update = asyncHandler(
	async (req: CustomRequest, res) => {
		const { userID } = req.params;
		const { oldPassword, newPassword, confirmNewPassword }: changePasswordBody =
			req.body;

		if (newPassword !== confirmNewPassword) {
			res.json(
				new JsonResponse(
					false,
					null,
					'Password and confirm password do not match',
					''
				)
			);
			return;
		}

		const user = await User.findById(userID);
		if (user === null) {
			res.json(new JsonResponse(false, null, 'User not found', ''));
			return;
		}

		const match = await bcrypt.compare(oldPassword, user.password);
		if (!match) {
			res.json(new JsonResponse(false, null, 'Old password do not match', ''));
			return;
		}

		const salt = process.env.BCRYPT_SALT;
		if (salt === undefined) throw new Error('Bcrypt salt Not Found');

		const hashedPassword = await bcrypt.hash(newPassword, parseInt(salt));

		const update = {
			password: hashedPassword,
		};

		const updatedUser = await User.findByIdAndUpdate(user._id, update, {
			new: true,
		}).exec();

		res.json(new JsonResponse(true, null, 'Password updated successfully', ''));
	}
);
