import express from 'express';
import {login, otpVerify, verifyUser} from '../controllers/auth.js';

const router = express.Router();

router.post('/login',login);
router.post('/otpverify',otpVerify);
router.post('/:id/verifyuser',verifyUser);

export default router;