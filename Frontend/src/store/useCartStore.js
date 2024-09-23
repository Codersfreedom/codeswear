import axios from "axios";
import toast from "react-hot-toast";
import { create } from "zustand";

const useCartStore = create((set, get) => ({
  cart: [],
  coupon: null,
  total: 0,
  subTotal: 0,
  isCouponApplied: false,

  getCartItems: async () => {
    try {
      const res = await axios.get("/api/cart");
      set({ cart: res.data });
      get().getCalculateTotals();
    } catch (error) {
      console.log("Error while fetching cart items");
    }
  },

  getMyCoupon: async () => {
    try {
      const res = await axios.get("/api/coupon");
      set({ coupon: res.data });
    } catch (error) {
      console.log("Error in getMyCoupon store", error.message);
    }
  },

  applyCoupon: async (code) => {
    try {
      const res = await axios.post("/api/coupon/validate", { code });
      console.log("coupon validate response", res.data);
      set({ coupon: res.data, isCouponApplied: true });
      get().getCalculateTotals();
      toast.success("Coupon applied");
    } catch (error) {
      console.log("Error in applyCoupon ", error.message);
      set({ isCouponApplied: false });
      toast.error(
        error.response?.data?.message || "Failed to apply coupon code"
      );
    }
  },
  removeCoupon: async () => {
    set({ coupon: null, isCouponApplied: false });
    get().getCalculateTotals();
    toast.success("Coupon removed");
  },

  addToCart: async (product) => {
    try {
      await axios.post("/api/cart/add", { productId: product._id });
      toast.success("Added to cart");

      set((prevState) => {
        const existingProduct = prevState.cart.find(
          (item) => item._id === product._id
        );

        const newCart = existingProduct
          ? prevState.cart.map((item) =>
              item._id === product._id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            )
          : [...prevState.cart, { ...product, quantity: 1 }];

        return { cart: newCart };
      });
      get().getCalculateTotals();
    } catch (error) {
      console.log(error.response.data.message);
      toast.error(error.response.data.message);
    }
  },
  getCalculateTotals: () => {
    const { cart, coupon } = get();
    
    const subTotal = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    let total = subTotal;
    if (coupon) {
      const discount = subTotal * (coupon.discountPercentage / 100);
      total = subTotal - discount;
    }
    set({ subTotal, total });
  },
  removeFromCart: async (productId) => {
    try {
      await axios.delete("/api/cart/remove", { data: { productId } });
      set((prevState) => ({
        cart: prevState.cart.filter((item) => item._id !== productId),
      }));
      toast.success("Item removed from cart");
      get().getCalculateTotals();
    } catch (error) {
      toast.error(error.response.data.message || "Error deleting the product");
    }
  },
  clearCart: () => {
    set({ cart: [], total: 0, subTotal: 0, coupon: null });
  },
  updateQuantity: async (productId, quantity) => {
    try {
      if (quantity === 0) {
        get().removeFromCart(productId);
        return;
      }
      await axios.put("/api/cart/update", { productId, quantity });

      set((prevState) => ({
        cart: prevState.cart.map((item) =>
          item._id === productId ? { ...item, quantity } : item
        ),
      }));
      get().getCalculateTotals();
    } catch (error) {
      toast.error(error.response.data.message || "Can't update quantity");
    }
  },
}));

export default useCartStore;
