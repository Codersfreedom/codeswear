import express from "express";
import {
  checkoutSuccess,
  createSession,
} from "../controllers/payment.controller.js";

const router = express.Router();

router.post("/createSession", createSession);
router.post("/checkout-success", checkoutSuccess);

export default router;
