import express from 'express';
import {newRequest} from "../controllers/request.js";

const router = express.Router();

router.post('/new', newRequest);
export default router;