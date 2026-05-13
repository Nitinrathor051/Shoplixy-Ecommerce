import axios from "./axiosConfig";

// ✅ Login
export const loginUser = async (userData) => {
  return await axios.post("/login", userData);
};

// ✅ Signup
export const signupUser = async (userData) => {
  return await axios.post("/addUser", userData);
};

// ✅ Get logged-in user's own profile
export const getUserProfile = async () => {
  return await axios.get("/getMyProfile", {
    headers: {
      Authorization: localStorage.getItem("token"),
    },
  });
};

// ✅ Get all users (admin only)
export const getAllUsers = async () => {
  return await axios.get("/getAllUsers", {
    headers: {
      Authorization: localStorage.getItem("token"),
    },
  });
};

// ✅ Update user profile
export const updateUserProfile = async (userId, updatedData) => {
  return await axios.put(`/updateUser/${userId}`, updatedData, {
    headers: {
      Authorization: localStorage.getItem("token"),
    },
  });
};

// ✅ Delete user account
export const deleteUserAccount = async (userId) => {
  return await axios.delete(`/deleteUser/${userId}`, {
    headers: {
      Authorization: localStorage.getItem("token"),
    },
  });  
};
