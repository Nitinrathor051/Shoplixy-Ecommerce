import axios from "./axiosConfig";

// ✅ Add product to cart
export const addToCart = async (data) => {
  return await axios.post("/addToCart", data, {
    headers: {
      Authorization: localStorage.getItem("token"),
    },
  });
};

// ✅ Get cart items
export const getCart = async () => {
  return await axios.get("/getCart", {
    headers: {
      Authorization: localStorage.getItem("token"),
    },
  });
};

// ✅ Remove specific product from cart
export const removeItem = async (productId) => {
  return await axios.delete(`/removeItem/${productId}`, {
    headers: {
      Authorization: localStorage.getItem("token"),
    },
  });
};

// ✅ Clear entire cart
export const clearCart = async () => {
  return await axios.delete("/clearCart", {
    headers: {
      Authorization: localStorage.getItem("token"),
    },
  });
};

// ✅ Update cart (e.g., quantity)
export const updateCart = async (data) => {
  return await axios.put("/updateCart", data, {
    headers: {
      Authorization: localStorage.getItem("token"),
    },
  });
};
