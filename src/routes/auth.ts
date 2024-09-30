import express from 'express';
import { login_get } from '../controllers/authController';
import { login_validation } from '../middlewares/validations';

const router = express.Router();

router.post('/login', login_validation, login_get);

export default router;
