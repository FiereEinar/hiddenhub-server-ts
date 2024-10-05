"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.message_delete = exports.message_post = exports.message_get = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const message_1 = __importDefault(require("../models/message"));
const response_1 = __importDefault(require("../models/response"));
const user_1 = __importDefault(require("../models/user"));
const express_validator_1 = require("express-validator");
const uploader_1 = require("../utils/uploader");
const cloudinary_1 = __importDefault(require("../utils/cloudinary"));
/**
 * GET - fetch conversation between sender and receiver
 */
exports.message_get = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { senderID, receiverID } = req.params;
    const messages = yield message_1.default.find({
        $or: [
            { sender: senderID, receiver: receiverID },
            { sender: receiverID, receiver: senderID },
        ],
    })
        .sort({ dateSent: 1 })
        .exec();
    res.json(new response_1.default(true, messages, 'Messages gathered', ''));
}));
/**
 * POST - send message from sender to receiver
 */
exports.message_post = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { senderID, receiverID } = req.params;
    const { message } = req.body;
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.json(new response_1.default(false, null, 'Error in message validation', errors.array()[0].msg));
        return;
    }
    let imgURL = '';
    let imgPublicID = '';
    if (req.file) {
        const result = yield (0, uploader_1.imageUploader)(req.file);
        if (result !== undefined) {
            imgURL = result.secure_url;
            imgPublicID = result.public_id;
        }
    }
    const newMessage = new message_1.default({
        sender: senderID,
        receiver: receiverID,
        message: message,
        image: {
            url: imgURL,
            publicID: imgPublicID,
        },
    });
    // make the sender and receiver friends
    yield user_1.default.findByIdAndUpdate(senderID, {
        $addToSet: { friends: receiverID },
    }).exec();
    yield user_1.default.findByIdAndUpdate(receiverID, {
        $addToSet: { friends: senderID },
    }).exec();
    yield newMessage.save();
    res.json(new response_1.default(true, newMessage, 'Message sent', ''));
}));
/**
 * DELETE - delete a message
 */
exports.message_delete = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { messageID } = req.params;
    const message = yield message_1.default.findById(messageID);
    if (message === null) {
        res.json(new response_1.default(false, null, 'Message ID not found', ''));
        return;
    }
    // if there is an existing id, delete that image from cloud storage
    if ((_a = message.image) === null || _a === void 0 ? void 0 : _a.publicID) {
        yield cloudinary_1.default.uploader.destroy(message.image.publicID);
    }
    const result = yield message_1.default.findByIdAndDelete(messageID);
    res.json(new response_1.default(true, result, 'Message deleted', ''));
}));
