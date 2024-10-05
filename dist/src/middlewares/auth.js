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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = __importDefault(require("../models/user"));
const constants_1 = require("../constants");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const auth = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const cookie = req.cookies;
    // check if the cookie exists
    if (!cookie[constants_1.cookieTokenName]) {
        res.sendStatus(401);
        return;
    }
    const token = cookie[constants_1.cookieTokenName];
    const secretKey = process.env.JWT_SECRET_KEY;
    if (secretKey === undefined)
        throw new Error('JWT Secret Key Not Found');
    // verify the token
    jsonwebtoken_1.default.verify(token, secretKey, (err, data) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            res.sendStatus(403);
            return;
        }
        const payload = data;
        const username = payload === null || payload === void 0 ? void 0 : payload.username;
        // check if the user exists
        const user = yield user_1.default.findOne({ username: username }).exec();
        if (user === null) {
            res.sendStatus(403);
            return;
        }
        req.user = user;
        next();
    }));
}));
exports.default = auth;
