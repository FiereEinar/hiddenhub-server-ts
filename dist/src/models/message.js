"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const MessageSchema = new Schema({
    sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    receiver: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    group: { type: Schema.Types.ObjectId, ref: 'Group', default: null },
    message: String,
    image: {
        url: String,
        publicID: String,
    },
    dateSent: { type: Date, default: Date.now },
    dateEdited: { type: Date, default: Date.now },
    seen: { type: Boolean, default: false },
    edited: { type: Boolean, default: false },
});
exports.default = mongoose_1.default.model('Message', MessageSchema);
