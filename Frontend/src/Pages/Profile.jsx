import React, { useEffect, useState } from "react";
import { getUserProfile, deleteUserAccount } from "../services/userService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

const Profile = () => {
  const [profile, setProfile] = useState({});
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getUserProfile();
        setProfile(res.data.user || res.data); // Adjust based on your backend return
      } catch (error) {
        toast.error("Failed to fetch profile.");
      }
    };

    if (token) fetchProfile();
  }, [token]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete your account?")) {
      try {
        await deleteUserAccount(profile._id);
        toast.success("Account deleted successfully.");
        localStorage.removeItem("token");
        navigate("/");
      } catch (error) {
        toast.error(error.response?.data?.msg || "Failed to delete account.");
      }
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>My Profile</h2>
      <p><strong>Name:</strong> {profile.name}</p>
      <p><strong>Email:</strong> {profile.email}</p>
      <p><strong>Role:</strong> {profile.role}</p>
      <p><strong>Contact:</strong> {profile.contact}</p>
      <p><strong>Gender:</strong> {profile.gender}</p>
      <p><strong>Age:</strong> {profile.age}</p>
      <p><strong>Address:</strong> {profile.address}</p>

      {/* Only user and seller can delete their own account */}
      {profile.role !== "admin" && (
        <button
          onClick={handleDelete}
          style={{ backgroundColor: "red", color: "white", padding: "10px", marginTop: "20px" }}
        >
          Delete My Account
        </button>
      )}
    </div>
  );
};

export default Profile;
