import asyncHandler from 'express-async-handler';
import { CustomRequest } from '../types/request';
import Message from '../models/message';
import JsonResponse from '../models/response';
import User from '../models/user';
import { validationResult } from 'express-validator';
import { imageUploader } from '../utils/uploader';
import cloudinary from '../utils/cloudinary';
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

/**
 * POST - send message from sender to receiver
 */
export const message_post = asyncHandler(async (req: CustomRequest, res) => {
	const { senderID, receiverID } = req.params;
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
		receiver: receiverID,
		message: message,
		image: {
			url: imgURL,
			publicID: imgPublicID,
		},
	});

	// make the sender and receiver friends
	await User.findByIdAndUpdate(senderID, {
		$addToSet: { friends: receiverID },
	}).exec();
	await User.findByIdAndUpdate(receiverID, {
		$addToSet: { friends: senderID },
	}).exec();

	await newMessage.save();

	res.json(new JsonResponse(true, newMessage, 'Message sent', ''));
});

/**
 * DELETE - delete a message
 */
export const message_delete = asyncHandler(async (req: CustomRequest, res) => {
	const { messageID } = req.params;

	const message = await Message.findById(messageID);

	if (message === null) {
		res.json(new JsonResponse(false, null, 'Message ID not found', ''));
		return;
	}

	// if there is an existing id, delete that image from cloud storage
	if (message.image?.publicID) {
		await cloudinary.uploader.destroy(message.image.publicID);
	}

	const result = await Message.findByIdAndDelete(messageID);

	res.json(new JsonResponse(true, result, 'Message deleted', ''));
});
