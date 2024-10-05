"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const auth_1 = __importDefault(require("../middlewares/auth"));
const multer_1 = __importDefault(require("../utils/multer"));
const validations_1 = require("../middlewares/validations");
const router = express_1.default.Router();
router.get('/', userController_1.users_get);
router.get('/:userID', auth_1.default, userController_1.user_info_get);
router.put('/:userID/cover', auth_1.default, multer_1.default.single('coverPhoto'), userController_1.user_cover_update);
router.put('/:userID/password', auth_1.default, validations_1.change_password_validation, userController_1.user_password_update);
router.put('/:userID/status', auth_1.default, userController_1.user_status_put);
router.put('/:userID', auth_1.default, validations_1.user_update_validation, multer_1.default.single('profileImg'), userController_1.user_update);
exports.default = router;
