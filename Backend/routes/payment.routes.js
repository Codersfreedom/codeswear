import express from "express";
import {
  checkoutSuccess,
  createSession,
} from "../controllers/payment.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.post("/createSession",protectRoute, createSession);
router.post("/checkout-success",protectRoute, checkoutSuccess);

export default router;
