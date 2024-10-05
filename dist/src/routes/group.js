"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../middlewares/auth"));
const multer_1 = __importDefault(require("../utils/multer"));
const validations_1 = require("../middlewares/validations");
const groupController_1 = require("../controllers/groupController");
const router = express_1.default.Router();
router.post('/', auth_1.default, multer_1.default.single('groupProfile'), validations_1.create_group_validation, groupController_1.group_post);
router.get('/:userID', auth_1.default, groupController_1.user_groups_get);
router.get('/:groupID/chats', groupController_1.group_chats_get);
router.get('/:groupID/info', groupController_1.group_info_get);
router.post('/chats/:senderID/:groupID', auth_1.default, multer_1.default.single('image'), validations_1.message_post_validation, groupController_1.group_chat_post);
exports.default = router;
