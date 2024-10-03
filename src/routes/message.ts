import express from 'express';
import auth from '../middlewares/auth';
import { message_get } from '../controllers/messageController';

const router = express.Router();

router.get('/:senderID/:receiverID', auth, message_get);

// router.post('/:senderID/:receiverID',
//   auth,
//   upload.single('image'),
//   message_post_validation,
//   message_post
// );

// router.delete('/:messageID',
//   auth,
//   message_delete
// );

export default router;
