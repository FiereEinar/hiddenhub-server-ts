import express from 'express';
import auth from '../middlewares/auth';
import upload from '../utils/multer';
import {
	create_group_validation,
	message_post_validation,
} from '../middlewares/validations';
import {
	group_chat_post,
	group_chats_get,
	group_info_get,
	group_post,
	user_groups_get,
} from '../controllers/groupController';

const router = express.Router();

router.post(
	'/',
	auth,
	upload.single('groupProfile'),
	create_group_validation,
	group_post
);

router.get('/:userID', auth, user_groups_get);

router.get('/:groupID/chats', group_chats_get);

router.get('/:groupID/info', group_info_get);

router.post(
	'/chats/:senderID/:groupID',
	auth,
	upload.single('image'),
	message_post_validation,
	group_chat_post
);

export default router;
