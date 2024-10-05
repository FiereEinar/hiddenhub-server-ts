"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.imageUploader = void 0;
const cloudinary_1 = __importDefault(require("./cloudinary"));
const streamifier_1 = __importDefault(require("streamifier"));
const imageUploader = (file) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary_1.default.uploader.upload_stream((err, result) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(result);
        });
        streamifier_1.default.createReadStream(file.buffer).pipe(uploadStream);
    });
};
exports.imageUploader = imageUploader;
