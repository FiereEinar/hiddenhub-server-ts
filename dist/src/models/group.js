"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const GroupSchema = new Schema({
    name: { type: String, minLength: 3, required: true },
    members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    admins: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    createdAt: { type: Date, default: Date.now },
    profile: {
        url: String,
        publicID: String,
    },
    cover: {
        url: String,
        publicID: String,
    },
});
exports.default = mongoose_1.default.model('Group', GroupSchema);
