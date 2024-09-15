import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is requied"],
    },
    description: {
      type: String,
      required: [true, "Product should have a description"],
    },
    price: {
      type: Number,
      min: 0,
      required: [true, "Product must have a price"],
    },
    image: {
      type: String,
      required: [true, "Image is requied"],
    },
    category: {
      type: String,
      required: [true, "Product must have a category"],
    },
    stock: {
      type: Number,
      min: 1,
      required: [true, "Product must have a stock"],
    },
    color: {
      type: Array,
      default: [],
    },
    size: {
      type: Array,
      default: [],
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
export default Product;
