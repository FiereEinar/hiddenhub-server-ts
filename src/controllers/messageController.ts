import asyncHandler from 'express-async-handler';
import { CustomRequest } from '../types/request';
import Message from '../models/message';
import JsonResponse from '../models/response';

/**
 * GET - fetch conversation between sender and receiver
 */
export const message_get = asyncHandler(async (req: CustomRequest, res) => {
	const { senderID, receiverID } = req.params;

	const messages = await Message.find({
		$or: [
			{ sender: senderID, receiver: receiverID },
			{ sender: receiverID, receiver: senderID },
		],
	})
		.sort({ dateSent: 1 })
		.exec();

	res.json(new JsonResponse(true, messages, 'Messages gathered', ''));
});
