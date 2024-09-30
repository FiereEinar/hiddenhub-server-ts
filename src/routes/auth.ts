import express from 'express';
import { login_get } from '../controllers/authController';

const router = express.Router();

router.get('/login', login_get);

export default router;