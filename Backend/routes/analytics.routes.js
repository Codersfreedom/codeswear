import express from 'express'
import { adminRoute } from '../middleware/adminRoute.js';
import { getAnalytics } from '../controllers/analytics.controller.js';

const router = express.Router();

router.get("/",adminRoute,getAnalytics)

export default router;