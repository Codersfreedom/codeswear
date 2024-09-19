import express from "express";
import { getCoupon, validateCoupon } from "../controllers/coupon.controller.js";

const router = express.Router();

router.get("/", getCoupon);
router.get("/validate", validateCoupon);

export default router;
