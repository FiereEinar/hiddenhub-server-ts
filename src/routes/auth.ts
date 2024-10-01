import express from 'express';
import { login_post, logout, signun_post } from '../controllers/authController';
import {
	login_validation,
	signup_validation,
} from '../middlewares/validations';

const router = express.Router();

router.post('/login', login_validation, login_post);
router.post('/signup', signup_validation, signun_post);
router.get('/logout', logout);

export default router;
