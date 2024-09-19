import express from "express";
import { addProduct, deleteProduct, getAllProducts, getCategoryProducts, getFeaturedProducts, getRecommandations, toggleFeatured } from "../controllers/product.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";
import { adminRoute } from "../middleware/adminRoute.js";

const router = express.Router();

router.get("/", protectRoute, adminRoute, getAllProducts);
router.get("/featured",getFeaturedProducts)
router.get("/addProduct",protectRoute,adminRoute,addProduct)
router.get("/:id",protectRoute,adminRoute,deleteProduct)
router.get("/toggleFeatured",protectRoute,adminRoute,toggleFeatured)
router.get("/recommandations",getRecommandations)
router.get("/:category",getCategoryProducts)

export default router;
