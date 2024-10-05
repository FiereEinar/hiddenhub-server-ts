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
exports.user_update = exports.user_status_put = exports.user_password_update = exports.user_cover_update = exports.users_get = exports.user_info_get = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const response_1 = __importDefault(require("../models/response"));
const user_1 = __importDefault(require("../models/user"));
const constants_1 = require("../constants");
const uploader_1 = require("../utils/uploader");
const cloudinary_1 = __importDefault(require("../utils/cloudinary"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
/**
 * GET - fetch user data
 */
exports.user_info_get = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_1.default.findById(req.params.userID, constants_1.forbiddenUserData)
        .populate({
        path: 'friends',
        select: constants_1.forbiddenUserData,
    })
        .select(constants_1.forbiddenUserData)
        .exec();
    res.json(new response_1.default(true, user, 'User data gathered', ''));
}));
/**
 * GET - fetch all users
 */
exports.users_get = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield user_1.default.find().select(constants_1.forbiddenUserData);
    res.json(new response_1.default(true, users, 'Users gathered', ''));
}));
/**
 * PUT - update user cover photo
 */
exports.user_cover_update = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userID = req.params.userID;
    const user = yield user_1.default.findById(userID).exec();
    if (user === null) {
        res.json(new response_1.default(false, null, 'User not found', ''));
        return;
    }
    let coverURL = user.cover.url;
    let coverPublicID = user.cover.publicID;
    if (req.file) {
        console.log('file exists');
        const result = yield (0, uploader_1.imageUploader)(req.file);
        if (result !== undefined) {
            console.log('result exists');
            coverURL = result.secure_url;
            coverPublicID = result.public_id;
        }
        // if there was a previous cover, delete that from the cloud
        if (user.cover.publicID) {
            yield cloudinary_1.default.uploader.destroy(user.cover.publicID);
        }
    }
    const update = {
        cover: {
            url: coverURL,
            publicID: coverPublicID,
        },
    };
    console.log('updating');
    const updatedUser = yield user_1.default.findByIdAndUpdate(user._id, update, {
        new: true,
    }).exec();
    res.json(new response_1.default(true, updatedUser, 'User cover photo updated', ''));
}));
/**
 * PUT - update user password
 */
exports.user_password_update = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userID } = req.params;
    const { oldPassword, newPassword, confirmNewPassword } = req.body;
    if (newPassword !== confirmNewPassword) {
        res.json(new response_1.default(false, null, 'Password and confirm password do not match', ''));
        return;
    }
    const user = yield user_1.default.findById(userID);
    if (user === null) {
        res.json(new response_1.default(false, null, 'User not found', ''));
        return;
    }
    const match = yield bcryptjs_1.default.compare(oldPassword, user.password);
    if (!match) {
        res.json(new response_1.default(false, null, 'Old password do not match', ''));
        return;
    }
    const salt = process.env.BCRYPT_SALT;
    if (salt === undefined)
        throw new Error('Bcrypt salt Not Found');
    const hashedPassword = yield bcryptjs_1.default.hash(newPassword, parseInt(salt));
    const update = {
        password: hashedPassword,
    };
    const updatedUser = yield user_1.default.findByIdAndUpdate(user._id, update, {
        new: true,
    }).exec();
    res.json(new response_1.default(true, null, 'Password updated successfully', ''));
}));
/**
 * PUT - update user status online/offline
 */
exports.user_status_put = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userID } = req.params;
    const { status } = req.body;
    const updatedUser = yield user_1.default.findByIdAndUpdate(userID, { isOnline: status }, { new: true }).exec();
    res.json(new response_1.default(true, updatedUser, 'User status updated', ''));
}));
/**
 * PUT - update user
 */
exports.user_update = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userID } = req.params;
    const { firstname, lastname, username, bio } = req.body;
    const user = yield user_1.default.findById(userID);
    if (user === null) {
        res.json(new response_1.default(false, null, 'User not found', ''));
        return;
    }
    let profileURL = user.profile.url;
    let profilePublicID = user.profile.publicID;
    if (req.file) {
        const result = yield (0, uploader_1.imageUploader)(req.file);
        if (result !== undefined) {
            profileURL = result.secure_url;
            profilePublicID = result.public_id;
            if (user.profile.publicID.length > 0) {
                yield cloudinary_1.default.uploader.destroy(user.profile.publicID);
            }
        }
    }
    const update = {
        firstname: firstname,
        lastname: lastname,
        username: username,
        bio: bio,
        profile: {
            url: profileURL,
            publicID: profilePublicID,
        },
    };
    const updateUser = yield user_1.default.findByIdAndUpdate(user._id, update, {
        new: true,
    }).exec();
    res.json(new response_1.default(true, updateUser, 'User updated', ''));
}));
