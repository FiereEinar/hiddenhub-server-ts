import express from 'express';
import {
	user_cover_update,
	user_info_get,
	users_get,
} from '../controllers/userController';
import auth from '../middlewares/auth';
import upload from '../utils/multer';

const router = express.Router();

router.get('/', users_get);

router.get('/:userID', auth, user_info_get);

router.put(
	'/:userID/cover',
	auth,
	upload.single('coverPhoto'),
	user_cover_update
);

// router.put(
// 	'/:userID/password',
// 	auth,
// 	change_password_validation,
// 	user_password_update
// );

// router.put('/:userID/status', auth, user_status_put);

// router.put('/:userID', auth, upload.single('profileImg'), user_update);

export default router;
