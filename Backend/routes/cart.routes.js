import express from "express";
import { addToCart, getAllCartItems, removeFromCart, updatQuntity } from "../controllers/cart.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.get("/",protectRoute, getAllCartItems);
router.post("/add", protectRoute,addToCart);
router.delete("/remove",protectRoute, removeFromCart);
router.put("/update",protectRoute, updatQuntity);

export default router;
