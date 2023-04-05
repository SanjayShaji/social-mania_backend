import express from 'express'
import { login, register, otpLogin } from '../../controllers/user/auth.js';

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/otplogin", otpLogin);

export default router;
