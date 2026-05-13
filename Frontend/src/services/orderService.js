import axios from "./axiosConfig";

// ✅ Place a new order
export const createOrder = async (data) => {
  return await axios.post("/placeOrder", data, {
    headers: {
      Authorization: localStorage.getItem("token"),
    },
  });
};

// ✅ Get all orders of the logged-in user
export const getMyOrders = async () => {
  return await axios.get("/getMyOrder", {
    headers: {
      Authorization: localStorage.getItem("token"),
    },
  });
};

// ✅ Cancel a specific order by ID
export const cancelOrder = async (orderId) => {
  return await axios.delete(`/cancelOrder/${orderId}`, {
    headers: {
      Authorization: localStorage.getItem("token"),
    },
  });
};
