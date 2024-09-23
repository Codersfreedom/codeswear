import express from 'express'
import { adminRoute } from '../middleware/adminRoute.js';
import { getAnalytics } from '../controllers/analytics.controller.js';
import { protectRoute } from '../middleware/protectRoute.js';

const router = express.Router();

router.get("/",protectRoute ,adminRoute,getAnalytics)

export default router;