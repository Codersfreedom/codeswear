import express from 'express'
import { getProfile, login, logout, refreshToken, signup } from '../controllers/auth.controller.js';
import { protectRoute } from '../middleware/protectRoute.js';

const router = express.Router();

router.post("/signup",signup)
router.post("/login",login)
router.post("/logout",logout)
router.post("/refresh-token",refreshToken)
router.get("/getProfile",protectRoute,getProfile)

export default router;