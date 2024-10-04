import asyncHandler from 'express-async-handler';
import { CustomRequest } from '../types/request';
import JsonResponse from '../models/response';
import { validationResult } from 'express-validator';
import { imageUploader } from '../utils/uploader';
import Group from '../models/group';
import { createGroupBody } from '../types/group';
import Message from '../models/message';

/**
 * POST - create a group
 */
export const group_post = asyncHandler(async (req: CustomRequest, res) => {
	const { creatorID, members, name }: createGroupBody = req.body;
	const parsedMembers = JSON.parse(members) as string[];

	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		res.json(
			new JsonResponse(
				false,
				null,
				'Error in group name validation',
				errors.array()[0].msg
			)
		);
		return;
	}

	let profileURL = '';
	let profilePublicID = '';

	if (req.file) {
		const result = await imageUploader(req.file);

		if (result !== undefined) {
			profileURL = result.secure_url;
			profilePublicID = result.public_id;
		}
	}

	const group = new Group({
		name: name,
		members: [...parsedMembers, creatorID],
		admins: [creatorID],
		profile: {
			url: profileURL,
			publicID: profilePublicID,
		},
	});

	await group.save();

	res.json(new JsonResponse(true, group, 'Group created', ''));
});

/**
 * GET - get user groups
 */
export const user_groups_get = asyncHandler(async (req: CustomRequest, res) => {
	const { userID } = req.params;
	const globalChatID = '6686265df39e586794515b27';

	// exclude the global chat
	const userGroups = await Group.find({
		members: userID,
		_id: { $ne: globalChatID },
	});

	res.json(new JsonResponse(true, userGroups, 'User groups gathered', ''));
});

/**
 * GET - fetch conversations in a group chat
 */
export const group_chats_get = asyncHandler(async (req: CustomRequest, res) => {
	const { groupID } = req.params;

	const messages = await Message.find({ group: groupID })
		.populate({
			path: 'sender',
			select: '-password',
		})
		.exec();

	res.json(new JsonResponse(true, messages, 'Group messages retrieved', ''));
});

/**
 * GET - fetch information about a group
 */
export const group_info_get = asyncHandler(async (req: CustomRequest, res) => {
	const { groupID } = req.params;

	const group = await Group.findById(groupID)
		.populate({
			path: 'members',
			select: '-password',
		})
		.populate({
			path: 'admins',
			select: '-password',
		})
		.exec();

	res.json(new JsonResponse(true, group, 'Message info retrieved', ''));
});

/**
 * POST - send a message to a group
 */
export const group_chat_post = asyncHandler(async (req: CustomRequest, res) => {
	const { senderID, groupID } = req.params;
	const { message }: { message: string } = req.body;

	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		res.json(
			new JsonResponse(
				false,
				null,
				'Error in message validation',
				errors.array()[0].msg
			)
		);
		return;
	}

	let imgURL = '';
	let imgPublicID = '';

	if (req.file) {
		const result = await imageUploader(req.file);

		if (result !== undefined) {
			imgURL = result.secure_url;
			imgPublicID = result.public_id;
		}
	}

	const newMessage = new Message({
		sender: senderID,
		group: groupID,
		message: message,
		image: {
			url: imgURL,
			publicID: imgPublicID,
		},
	});

	await newMessage.save();

	res.json(new JsonResponse(true, newMessage, 'Message sent to goup', ''));
});
