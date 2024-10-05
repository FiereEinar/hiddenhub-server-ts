"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.create_group_validation = exports.change_password_validation = exports.user_update_validation = exports.message_post_validation = exports.login_validation = exports.signup_validation = void 0;
const express_validator_1 = require("express-validator");
exports.signup_validation = [
    (0, express_validator_1.body)('username', 'Username must not be empty').trim().isLength({ min: 1 }),
    (0, express_validator_1.body)('password', 'Password must not be empty').trim().isLength({ min: 1 }),
    (0, express_validator_1.body)('firstname', 'First name must not be empty').trim().isLength({ min: 1 }),
    (0, express_validator_1.body)('lastname', 'Last name must not be empty').trim().isLength({ min: 1 }),
];
exports.login_validation = [
    (0, express_validator_1.body)('username', 'Username must not be empty').trim().isLength({ min: 1 }),
    (0, express_validator_1.body)('password', 'Password must not be empty').trim().isLength({ min: 1 }),
];
exports.message_post_validation = [(0, express_validator_1.body)('message').trim()];
exports.user_update_validation = [
    (0, express_validator_1.body)('username', 'Username must not be empty').trim().isLength({ min: 1 }),
    (0, express_validator_1.body)('firstname', 'First name must not be empty').trim().isLength({ min: 1 }),
    (0, express_validator_1.body)('lastname', 'Last name must not be empty').trim().isLength({ min: 1 }),
];
exports.change_password_validation = [
    (0, express_validator_1.body)('oldPassword', 'Password must be atleast 5 characters')
        .trim()
        .isLength({ min: 5 }),
    (0, express_validator_1.body)('newPassword', 'Password must be atleast 5 characters')
        .trim()
        .isLength({ min: 5 }),
    (0, express_validator_1.body)('confirmNewPassword', 'Password must be atleast 5 characters')
        .trim()
        .isLength({ min: 5 }),
];
exports.create_group_validation = [
    (0, express_validator_1.body)('name', 'Group name must be atleast 3 characters')
        .trim()
        .isLength({ min: 3 }),
];
