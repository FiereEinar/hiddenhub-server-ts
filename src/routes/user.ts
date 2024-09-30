import express from 'express';
import { user_info_get } from '../controllers/userController';
import auth from '../middlewares/auth';

const router = express.Router();

router.get('/:userID', auth, user_info_get);

export default router;
