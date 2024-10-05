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
exports.group_chat_post = exports.group_info_get = exports.group_chats_get = exports.user_groups_get = exports.group_post = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const response_1 = __importDefault(require("../models/response"));
const express_validator_1 = require("express-validator");
const uploader_1 = require("../utils/uploader");
const group_1 = __importDefault(require("../models/group"));
const message_1 = __importDefault(require("../models/message"));
/**
 * POST - create a group
 */
exports.group_post = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { creatorID, members, name } = req.body;
    const parsedMembers = JSON.parse(members);
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.json(new response_1.default(false, null, 'Error in group name validation', errors.array()[0].msg));
        return;
    }
    let profileURL = '';
    let profilePublicID = '';
    if (req.file) {
        const result = yield (0, uploader_1.imageUploader)(req.file);
        if (result !== undefined) {
            profileURL = result.secure_url;
            profilePublicID = result.public_id;
        }
    }
    const group = new group_1.default({
        name: name,
        members: [...parsedMembers, creatorID],
        admins: [creatorID],
        profile: {
            url: profileURL,
            publicID: profilePublicID,
        },
    });
    yield group.save();
    res.json(new response_1.default(true, group, 'Group created', ''));
}));
/**
 * GET - get user groups
 */
exports.user_groups_get = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userID } = req.params;
    const globalChatID = '6686265df39e586794515b27';
    // exclude the global chat
    const userGroups = yield group_1.default.find({
        members: userID,
        _id: { $ne: globalChatID },
    });
    res.json(new response_1.default(true, userGroups, 'User groups gathered', ''));
}));
/**
 * GET - fetch conversations in a group chat
 */
exports.group_chats_get = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { groupID } = req.params;
    const messages = yield message_1.default.find({ group: groupID })
        .populate({
        path: 'sender',
        select: '-password',
    })
        .exec();
    res.json(new response_1.default(true, messages, 'Group messages retrieved', ''));
}));
/**
 * GET - fetch information about a group
 */
exports.group_info_get = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { groupID } = req.params;
    const group = yield group_1.default.findById(groupID)
        .populate({
        path: 'members',
        select: '-password',
    })
        .populate({
        path: 'admins',
        select: '-password',
    })
        .exec();
    res.json(new response_1.default(true, group, 'Message info retrieved', ''));
}));
/**
 * POST - send a message to a group
 */
exports.group_chat_post = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { senderID, groupID } = req.params;
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
        group: groupID,
        message: message,
        image: {
            url: imgURL,
            publicID: imgPublicID,
        },
    });
    yield newMessage.save();
    res.json(new response_1.default(true, newMessage, 'Message sent to goup', ''));
}));
