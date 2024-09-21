import axios from "axios";
import toast from "react-hot-toast";
import { create } from "zustand";

const useProductStore = create((set) => ({
  products: [],
  loading: false,

  setProducts: (products) => set({ products }),

  createProduct: async (productData) => {
    console.log(productData);
    set({ loading: true });
    try {
      const res = await axios.post("/api/products/addProduct", productData);
      console.log(res);
      set((prevData) => ({
        products: [...prevData.products, res.data],
        loading: false,
      }));
      toast.success("Product added");
    } catch (error) {
      set({ loading: false });
      toast.error(error.response.data.message);
    }
  },

  fetchAllProducts: async () => {
    set({ loading: true });
    try {
      const res = await axios.get("/api/products");
      set({ products: res.data.products, loading: false });
    } catch (error) {
      set({ loading: false });
      toast.error(error.response.data.message);
    }
  },

  toggleFeaturedProduct: async (id) => {
    try {
      const res = await axios.post("/api/products/toggleFeatured", { id });
      console.log(res)
      set((prevProducts) => ({
        products: prevProducts.products.map((product) =>
          product._id === id
            ? { ...product, isFeatured: res.data.isFeatured }
            : product
        ),
        loading: false,
      }));
    } catch (error) {
        set({ loading: false });
        toast.error(error.response.data.message);
    }
  },
  deleteProduct: async (id) =>{
    set({loading:true})
    try {
         await axios.delete(`/api/products/delete/${id}`);
        set((prevProducts)=>({
            products: prevProducts.products.filter((product)=>product._id != id),
            loading:false
        }))
    } catch (error) {
        set({ loading: false });
        toast.error(error.response.data.message);
    }
  }
}));

export default useProductStore;
