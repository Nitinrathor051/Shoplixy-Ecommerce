import axios from "axios";

// ✅ Safe fallback (agar env missing ho)
const BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://shoplixy-ecommerce-2.onrender.com";

const instance = axios.create({
  baseURL: `${BASE_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

export default instance;