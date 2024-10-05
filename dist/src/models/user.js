"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const UserSchema = new Schema({
    firstname: { type: String, minLength: 1, required: true },
    lastname: { type: String, minLength: 1, required: true },
    username: { type: String, minLength: 1, required: true, unique: true },
    password: { type: String, minLength: 1, required: true },
    isOnline: { type: Boolean, default: false },
    bio: { type: String, default: '' },
    friends: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    dateJoined: { type: Date, default: Date.now },
    profile: {
        url: String,
        publicID: String,
    },
    cover: {
        url: String,
        publicID: String,
    },
    refreshToken: { type: String },
});
exports.default = mongoose_1.default.model('User', UserSchema);
