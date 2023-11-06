import express from 'express';
import {addToBus, createBus, listBus, getRidesCountForBusInLastTenDays} from "../controllers/bus.js";

const router = express.Router();

router.post('/add',addToBus);
router.post('/create',createBus);
router.get('/list',listBus);
router.post('/count',getRidesCountForBusInLastTenDays);
export default router;