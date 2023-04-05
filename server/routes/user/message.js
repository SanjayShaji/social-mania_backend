import expres from 'express';
import { addMessage, getMessages } from '../../controllers/user/message.js';
import { verifyToken } from "../../middlewares/user/auth.js";

const router = expres.Router();

router.post('/',verifyToken, addMessage);
router.get('/:chatId',verifyToken, getMessages);

export default router;
