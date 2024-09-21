import { create } from "zustand";
import toast from "react-hot-toast";
import axios from "axios";

const useAuthStore = create((set, get) => ({
  authUser: null,
  loading: false,
  authChecking: true,

  signup: async ({ name, email, password, cpassword }) => {
    if (!name || !email || !password || !cpassword)
      return toast.error("All fields are requied");

    if (password != cpassword) return toast.error("Password mismatch");
    set({ loading: true });
    try {
      const res = await axios.post("/api/auth/signup", {
        name,
        email,
        password,
      });

      set({ authUser: res.data.user, loading: false });
      toast.success(res.data.message);
    } catch (error) {
      set({ loading: false });
      return toast.error(error.response.data.message);
    }
  },
  login: async (email, password) => {
    if (!email || !password) return toast.error("Please enter all fields");
    set({ loading: true });
    try {
      const res = await axios.post("/api/auth/login", { email, password });

      set({ authUser: res.data.user, loading: false });
      toast.success("Login success");
    } catch (error) {
      set({ loading: false });
      return toast.error(error.response.data.message);
    }
  },

  logout: async () => {
    set({ loading: true });
    try {
      const res = await axios.post("/api/auth/logout");
      set({ authUser: null, loading: false });
      toast.success(res.data.message);
    } catch (error) {
      set({ loading: false });
      return toast.error(error.response.data.message);
    }
  },

  checkAuth: async () => {
    set({ authChecking: true });
    try {
      const res = await axios.get("/api/auth/getProfile");
      set({ authUser: res.data.user, authChecking: false });
    } catch (error) {
      set({ authChecking: false });
      return toast.error(error.response.data.message);
    }
  },

  
}));

export default useAuthStore;
