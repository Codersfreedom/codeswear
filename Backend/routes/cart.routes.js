import express from "express";
import { addToCart, getAllCartItems, removeFromCart, updatQuntity } from "../controllers/cart.controller.js";

const router = express.Router();

router.get("/", getAllCartItems);
router.post("/add", addToCart);
router.delete("/remove", removeFromCart);
router.put("/update", updatQuntity);

export default router;
