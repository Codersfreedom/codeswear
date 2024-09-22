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
      console.log(res);
      set({ cart: res.data });
      get().getCalculateTotals();
    } catch (error) {
      console.log("Error while fetching cart items");
    }
  },

  addToCart: async (product) => {
    console.log("addto cart called");

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
    console.log(productId)
    try {
      await axios.delete('/api/cart/remove',{data:{productId}});
      set((prevState) => ({
        cart: prevState.cart.filter((item) => item._id !== productId),
      }));
      toast.success("Item removed from cart");
    } catch (error) {
      toast.error(error.response.data.message || "Error deleting the product");
    }
  },
  updateQuantity: async ()=>{

  }
}));

export default useCartStore;
