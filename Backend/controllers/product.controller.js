import cloudinary from "../db/cloudinary.js";
import { redis } from "../db/redis.js";
import Product from "../models/product.model.js";

export async function getAllProducts(req, res) {
  try {
    const products = await Product.find({});

    if (products) {
      res.status(200).json({ products });
    }
  } catch (error) {
    console.log("Internal server error in product controller", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getFeaturedProducts(req, res) {
  try {
    let featuredProducts = await redis.get("featured-products"); // checking if the featured products stores in redis
    if (featuredProducts) {
      return res.status(200).json(JSON.parse(featuredProducts));
    }

    // lean() returns plain javascript object instate of mongodb object which is good for the perfermence
    featuredProducts = await Product.find({ isFeatured: true }).lean();
    if (!featuredProducts) {
      return res.status(404).json({ message: "No featured products found" });
    }

    await redis.set("featured-products", JSON.stringify(featuredProducts));

    res.status(200).json({ featuredProducts });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    console.log("Error in featured product controller", error.message);
  }
}

export async function addProduct(req, res) {
  try {
    const {
      name,
      description,
      price,
      image,
      category,
      stock,
      color,
      size,
      isFeatured,
    } = req.body;
    let cloudinaryResponse = null;

    if (image) {
      cloudinaryResponse = await cloudinary.uploader.upload(image, {
        folder: "products",
      });
    }

    const newProduct = await Product.create({
      name,
      description,
      price,
      image: cloudinaryResponse.secure_url ? cloudinaryResponse.secure_url : "",
      category,
      stock,
      color,
      size,
      isFeatured,
    });

    if (newProduct) {
      res.status(201).json({ newProduct });
    }
  } catch (error) {
    console.log(
      "Internal server error in Add Product controller",
      error.message
    );
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function deleteProduct(req, res) {
  const { id } = req.params;
  try {
    const product = await Product.findById({ id });

    if (!product) return res.status(404).json({ message: "Product not found" });

    if (product.image) {
      const publicId = product.image.split("/").pop().split(".")[0];
      try {
        await cloudinary.uploader.destroy(`products/${publicId}`);
        console.log("Image deleted from cloudinary");
      } catch (error) {
        console.log("Image can't deleted from cloudinary", error.message);
      }
    }
    await Product.findByIdAndDelete({ id });
    res.status(204).json({ message: "Deleted successfully" });
  } catch (error) {
    console.log("Error in delete product controller", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}
