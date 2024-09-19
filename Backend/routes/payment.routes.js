import express from "express";
import { createSession } from "../controllers/payment.controller.js";

const router = express.Router();

router.get("/createSession", createSession);

export default router;
