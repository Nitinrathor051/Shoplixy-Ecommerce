import axios from "./axiosConfig";

// ✅ Get all products (public)
export const getAllProducts = async () => {
  return await axios.get("/getAllProducts");
};

// ✅ Get product by ID
export const getProductById = async (productId) => {
  return await axios.get(`/getProductById/${productId}`);
};

// ✅ Get products by query (search/filter)
export const getProductsByQuery = async (queryParams) => {
  return await axios.get("/getProductsByQuery", {
    params: queryParams,
  });
};

// ✅ Add product (seller or admin only)
export const addProduct = async (productData) => {
  return await axios.post("/addProducts", productData, {
    headers: {
      Authorization: localStorage.getItem("token"),
    },
  });
};

// ✅ Update product (seller or admin only)
export const updateProduct = async (productId, updatedData) => {
  return await axios.put(`/updateProduct/${productId}`, updatedData, {
    headers: {
      Authorization: localStorage.getItem("token"),
    },
  });
};

// ✅ Delete product (seller or admin only)
export const deleteProduct = async (productId) => {
  return await axios.delete(`/deleteProduct/${productId}`, {
    headers: {
      Authorization: localStorage.getItem("token"),
    },
  });
};
