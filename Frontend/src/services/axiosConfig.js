import axios from "axios";

// ✅ Use Vite environment variable
const instance = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`, // add /api if backend routes start with /api
  headers: {
    "Content-Type": "application/json",
  },
});

export default instance;