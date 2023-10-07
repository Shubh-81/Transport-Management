import express from 'express';
import {addToBus, createBus} from "../controllers/bus.js";

const router = express.Router();

router.post('/add',addToBus);
router.post('/create',createBus);
export default router;