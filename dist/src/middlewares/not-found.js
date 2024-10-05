"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundHandler = notFoundHandler;
const HttpError_1 = require("../errors/HttpError");
function notFoundHandler(req, res, next) {
    const error = new HttpError_1.HttpError('Not Found', 404);
    next(error);
}
