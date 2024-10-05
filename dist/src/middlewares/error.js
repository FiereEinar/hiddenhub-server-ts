"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
function errorHandler(err, req, res, next) {
    res.status(err.status || 500);
    res.json({ message: err.message, status: err.status, stack: err.stack });
}
