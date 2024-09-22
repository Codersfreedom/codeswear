import Product from "../models/product.model.js";

export async function getAllCartItems(req, res) {
  try {
    const products = await Product.find({ _id: { $in: req.user.cartItems } });

    const productItems = products.map((product) => {
      const cartItems = req.user.cartItems.find(
        (items) => items.id === product.id
      );

      return { ...product.toJSON(), quantity: cartItems.quantity };
    });

    res.status(200).json(productItems);
  } catch (error) {
    console.log("Error in Cart controller", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function addToCart(req, res) {
  try {
    const { productId } = req.body;
    const user = req.user;
    console.log(productId);
    const existingProduct = await user.cartItems.find(
      (items) => items.id === productId
    );

    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      user.cartItems.push(productId);
    }

    await user.save();
    res.status(201).json(user.cartItems);
  } catch (error) {
    console.log("Error in Cart controller", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function removeFromCart(req, res) {
  try {
    const { productId } = req.body;
    const user = req.user;

    if (!productId)
      return res
        .status(406)
        .json({ message: "Please provide a valid product id" });

    user.cartItems = user.cartItems.filter((items) => items.id != productId);

    await user.save();
    res.status(200).json(user.cartItems);
  } catch (error) {
    console.log("Error in Cart controller", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function updatQuntity(req, res) {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    const user = req.user;

    if (!productId)
      return res
        .status(406)
        .json({ message: "Please provide a valid product id" });

    const existingProduct = await user.cartItems.find(productId);
    if (!existingProduct)
      return res.status(404).json({ message: "Item not found" });

    if (quantity === 0) {
      user.cartItems = user.cartItems.filter((items) => items.id != productId);
      await user.save();
      return res.status(200).json(user.cartItems);
    }

    existingProduct.quantity = quantity;

    await user.save();
    res.status(200).json(user.cartItems);
  } catch (error) {
    console.log("Error in Cart controller", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}
