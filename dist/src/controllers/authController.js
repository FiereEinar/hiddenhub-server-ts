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
exports.check_auth = exports.logout = exports.signun_post = exports.login_post = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const express_validator_1 = require("express-validator");
const response_1 = __importDefault(require("../models/response"));
const user_1 = __importDefault(require("../models/user"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const constants_1 = require("../constants");
/**
 * POST - login
 */
exports.login_post = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    // check for body values errors
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.json(new response_1.default(false, null, 'Login body values error', errors.array()[0].msg));
        return;
    }
    // check if the user exists
    const user = yield user_1.default.findOne({ username: username }).exec();
    if (user === null) {
        res.json(new response_1.default(false, null, 'Invalid username', ''));
        return;
    }
    // check if the passwords match
    const match = yield bcryptjs_1.default.compare(password, user.password);
    if (!match) {
        res.json(new response_1.default(false, null, 'Invalid password', ''));
        return;
    }
    const secretKey = process.env.JWT_SECRET_KEY;
    if (secretKey === undefined)
        throw new Error('JWT Secret Key Not Found');
    // generate a token
    const token = jsonwebtoken_1.default.sign({ username: user.username }, secretKey, {
        expiresIn: '1d',
    });
    // save the token on user
    user.refreshToken = token;
    yield user.save();
    // send the token as cookie
    res.cookie(constants_1.cookieTokenName, token, {
        secure: true,
        httpOnly: true,
        sameSite: 'none',
        maxAge: 1000 * 60 * 60 * 24,
    });
    res.json(new response_1.default(true, null, 'Login successfull', ''));
}));
/**
 * POST - Signup
 */
exports.signun_post = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { firstname, lastname, username, password } = req.body;
    const defaultImgURL = 'https://res.cloudinary.com/dkidfx99m/image/upload/v1719707237/uiotniwyo7xalhdurrf9.webp';
    const defaultImgID = 'zioyniwyo9xalhduarf1';
    // check for body validation errors
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.json(new response_1.default(false, null, 'Validation error', errors.array()[0].msg));
        return;
    }
    // check if a given username already exists
    const existingUsername = yield user_1.default.findOne({ username: username }).exec();
    if (existingUsername !== null) {
        res.json(new response_1.default(false, null, 'Username already exists', ''));
        return;
    }
    const salt = process.env.BCRYPT_SALT;
    if (salt === undefined)
        throw new Error('Bcrypt salt Not Found');
    // hash the password
    const hashedPassword = yield bcryptjs_1.default.hash(password, parseInt(salt));
    // create the user
    const user = new user_1.default({
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
    yield user.save();
    res.json(new response_1.default(true, null, 'Signup successfull', ''));
}));
/**
 * GET - Logout
 */
exports.logout = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const cookie = req.cookies;
    const token = cookie[constants_1.cookieTokenName];
    // check if the cookie exists
    if (!token) {
        res.sendStatus(204);
        return;
    }
    // check if a user exists with that token
    const user = yield user_1.default.findOne({ refreshToken: token });
    if (user !== null) {
        user.refreshToken = '';
        yield user.save();
    }
    // clear the cookie
    res.clearCookie(constants_1.cookieTokenName, {
        secure: true,
        httpOnly: true,
        sameSite: 'none',
    });
    res.sendStatus(200);
}));
/**
 * GET - Check for token validity
 */
exports.check_auth = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const cookies = req.cookies;
    const token = cookies[constants_1.cookieTokenName];
    // check if the token exists
    if (!token) {
        res.sendStatus(401);
        return;
    }
    // check if a user with that token exists
    const user = yield user_1.default.findOne({ refreshToken: token }).exec();
    if (user == null) {
        res.sendStatus(403);
        return;
    }
    const secretKey = process.env.JWT_SECRET_KEY;
    if (secretKey === undefined)
        throw new Error('JWT Secret Key Not Found');
    // verify the token
    jsonwebtoken_1.default.verify(token, secretKey, (err, data) => {
        if (err) {
            res.sendStatus(403);
            return;
        }
        res.sendStatus(200);
    });
}));
