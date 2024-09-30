import { body } from 'express-validator';

export const signup_validation = [
	body('username', 'Username must not be empty').trim().isLength({ min: 1 }),

	body('password', 'Password must not be empty').trim().isLength({ min: 1 }),

	body('firstname', 'First name must not be empty').trim().isLength({ min: 1 }),

	body('lastname', 'Last name must not be empty').trim().isLength({ min: 1 }),
];

export const login_validation = [
	body('username', 'Username must not be empty').trim().isLength({ min: 1 }),

	body('password', 'Password must not be empty').trim().isLength({ min: 1 }),
];

export const message_post_validation = [body('message').trim()];

export const user_update_validation = [
	body('username', 'Username must not be empty').trim().isLength({ min: 1 }),

	body('firstname', 'First name must not be empty').trim().isLength({ min: 1 }),

	body('lastname', 'Last name must not be empty').trim().isLength({ min: 1 }),
];

export const change_password_validation = [
	body('oldPassword', 'Password must be atleast 5 characters')
		.trim()
		.isLength({ min: 5 }),

	body('newPassword', 'Password must be atleast 5 characters')
		.trim()
		.isLength({ min: 5 }),

	body('confirmNewPassword', 'Password must be atleast 5 characters')
		.trim()
		.isLength({ min: 5 }),
];

export const create_group_validation = [
	body('name', 'Group name must be atleast 3 characters')
		.trim()
		.isLength({ min: 3 }),
];
