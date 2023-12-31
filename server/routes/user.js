import express from "express";
import { verifyToken } from "../middleware/auth.js";
import {
    getUser,
    getUserFromEmail,
    resetPassword,
    sendEmail
} from '../controllers/user.js';

const router = express.Router();

router.get('/:id',verifyToken,getUser);
router.post('/useremail',getUserFromEmail);
router.post('/resetpassword',resetPassword);
router.post('/email',sendEmail);

export default router;