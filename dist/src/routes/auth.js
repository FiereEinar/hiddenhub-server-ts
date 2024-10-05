"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const validations_1 = require("../middlewares/validations");
const router = express_1.default.Router();
router.post('/login', validations_1.login_validation, authController_1.login_post);
router.post('/signup', validations_1.signup_validation, authController_1.signun_post);
router.get('/logout', authController_1.logout);
router.get('/check-auth', authController_1.check_auth);
exports.default = router;
