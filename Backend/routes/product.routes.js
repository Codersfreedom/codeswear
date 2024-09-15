import express from "express";
import { addProduct, getAllProducts, getFeaturedProducts } from "../controllers/product.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";
import { adminRoute } from "../middleware/adminRoute.js";

const router = express.Router();

router.get("/", protectRoute, adminRoute, getAllProducts);
router.get("/featured",getFeaturedProducts)
router.get("/addProduct",protectRoute,adminRoute,addProduct)
router.get("/:id",protectRoute,adminRoute,deleteProduct)

export default router;
