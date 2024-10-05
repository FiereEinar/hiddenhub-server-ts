"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../middlewares/auth"));
const messageController_1 = require("../controllers/messageController");
const multer_1 = __importDefault(require("../utils/multer"));
const validations_1 = require("../middlewares/validations");
const router = express_1.default.Router();
router.get('/:senderID/:receiverID', auth_1.default, messageController_1.message_get);
router.post('/:senderID/:receiverID', auth_1.default, multer_1.default.single('image'), validations_1.message_post_validation, messageController_1.message_post);
router.delete('/:messageID', auth_1.default, messageController_1.message_delete);
exports.default = router;
