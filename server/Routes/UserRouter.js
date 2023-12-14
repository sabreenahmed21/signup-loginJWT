import express from 'express';
const router = express.Router();
import { protect, forgetPassword, login, resetPassword, signup,  verifyCode, verifyEmail } from '../Controllers/AuthController.js';
import { getusers, getOneUser,  deleteMe} from '../Controllers/UserController.js';

router.get('/users', getusers);
router.get('/user/:id', getOneUser);
router.post('/signup', signup);
router.post('/login', login);
router.post('/forgetpassword', forgetPassword);
router.patch('/resetpassword/:token', resetPassword);
router.post('/verifycode', verifyCode);
router.get('/verify-email',verifyEmail);

router.delete('/delete-me', protect, deleteMe);

export default router;
