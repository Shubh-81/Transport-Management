import express from "express";
import {newAnnouncement, getAnnouncements} from "../controllers/announcement.js";

const router = express.Router();

router.post('/create',newAnnouncement);
router.get('/get',getAnnouncements);

export default router;