const userModel = require("../models/userModel");
const {
  isValid,
  isValidName,
  isValidEmail,
  isValidPhone,
  isValidPassword,
} = require("./validator");

const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

// ✅ Add Users
const addUsers = async (req, res) => {
  try {
    let userData = req.body;
    if (Object.keys(userData).length === 0) {
      return res.status(400).json({ msg: "Bad Request, No Data Provided" });
    }

    let { name, email, contact, password, address, gender, age, role } = userData;

    if (!isValid(name) || !isValidName(name)) {
      return res.status(400).json({ msg: "Valid Name is Required" });
    }

    if (!isValid(email) || !isValidEmail(email)) {
      return res.status(400).json({ msg: "Valid Email is Required" });
    }
    if (await userModel.findOne({ email })) {
      return res.status(400).json({ msg: "Email Already Exists" });
    }

    if (!isValid(contact) || !isValidPhone(contact)) {
      return res.status(400).json({ msg: "Valid Contact is Required" });
    }
    if (await userModel.findOne({ contact })) {
      return res.status(400).json({ msg: "Contact Already Exists" });
    }

    if (!isValid(address)) {
      return res.status(400).json({ msg: "Address is Required" });
    }

    if (!isValid(gender)) {
      return res.status(400).json({ msg: "Gender is Required" });
    }
    const validGenders = ["male", "female", "others"];
    if (!validGenders.includes(gender.trim().toLowerCase())) {
      return res.status(400).json({ msg: "Gender must be 'male', 'female' or 'others'" });
    }

    if (!isValid(password) || !isValidPassword(password)) {
      return res.status(400).json({
        msg: "Password must be 6-20 chars, include uppercase, lowercase, number, and special character",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    if (!isValid(age)) {
      return res.status(400).json({ msg: "Age is Required" });
    }

    // ✅ Validate Role
    const validRoles = ["user", "seller", "admin"];
    if (!role || !validRoles.includes(role.trim().toLowerCase())) {
      role = "user"; // default role
    } else {
      role = role.trim().toLowerCase();
    }

    const user = await userModel.create({
      name,
      email,
      contact,
      password: hashedPassword,
      address,
      gender,
      age,
      role,
    });

    return res.status(201).json({ msg: "User Added Successfully", user });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error", error });
  }
};

// ✅ Get All Users
const getUsers = async (req, res) => {
  try {
    const userData = await userModel.find();
    if (userData.length === 0) {
      return res.status(404).json({ msg: "No User Found" });
    }
    return res.status(200).json({ userData });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

// ✅ Get My Profile
const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await userModel.findById(userId).select("-password");
    if (!user) return res.status(404).json({ msg: "User not found" });
    return res.status(200).json({ msg: "Profile fetched successfully", user });
  } catch (err) {
    console.error("Profile Fetch Error:", err);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

// ✅ Update User
const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const loggedInUserId = req.user.userId;
    const data = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ msg: "Invalid User Id" });
    }

    if (userId !== loggedInUserId) {
      return res.status(403).json({ msg: "Unauthorized Access" });
    }

    if (Object.keys(data).length === 0) {
      return res.status(400).json({ msg: "Bad Request, No Data Provided" });
    }

    let { name, email, contact, password, address, gender, age } = data;
    let salt, hashedPassword;

    if (name !== undefined && (!isValid(name) || !isValidName(name))) {
      return res.status(400).json({ msg: "Valid Name is Required" });
    }

    if (email !== undefined) {
      if (!isValid(email) || !isValidEmail(email)) {
        return res.status(400).json({ msg: "Valid Email is Required" });
      }
      const duplicate = await userModel.findOne({ email });
      if (duplicate) return res.status(400).json({ msg: "Email Already Exists" });
    }

    if (contact !== undefined) {
      if (!isValid(contact) || !isValidPhone(contact)) {
        return res.status(400).json({ msg: "Valid Contact is Required" });
      }
      const duplicate = await userModel.findOne({ contact });
      if (duplicate) return res.status(400).json({ msg: "Contact Already Exists" });
    }

    if (password !== undefined) {
      if (!isValid(password) || !isValidPassword(password)) {
        return res.status(400).json({
          msg: "Password must be 6-20 chars, include uppercase, lowercase, number, and special character",
        });
      }
      salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(password, salt);
    }

    if (address !== undefined && !isValid(address)) {
      return res.status(400).json({ msg: "Address is Required" });
    }

    if (gender !== undefined) {
      if (!isValid(gender)) {
        return res.status(400).json({ msg: "Gender is Required" });
      }
      const validGenders = ["male", "female", "others"];
      if (!validGenders.includes(gender.trim().toLowerCase())) {
        return res.status(400).json({ msg: "Gender must be 'male', 'female' or 'others'" });
      }
    }

    if (age !== undefined && !isValid(age)) {
      return res.status(400).json({ msg: "Age is Required" });
    }

    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      {
        name,
        email,
        contact,
        password: hashedPassword,
        address,
        gender,
        age,
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ msg: "User Not Found" });
    }

    return res.status(200).json({ msg: "User Data Updated Successfully", update: updatedUser });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

// ✅ Delete User
const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const loggedInUserId = req.user.userId;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ msg: "Invalid User Id" });
    }

    if (userId !== loggedInUserId) {
      return res.status(403).json({ msg: "Unauthorized Access" });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: "User Not Found" });
    }

    await userModel.findByIdAndDelete(userId);
    return res.status(200).json({ msg: "User Deleted Successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

// ✅ Login User
const loginUser = async (req, res) => {
  try {
    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({ msg: "Bad Request, No Data Found" });
    }

    let { email, password } = req.body;

    if (!isValid(email)) {
      return res.status(400).json({ msg: "Email is required" });
    }

    if (!isValid(password)) {
      return res.status(400).json({ msg: "Password is required" });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: "User not Found with this email" });
    }

    const matchUser = await bcrypt.compare(password, user.password);
    if (!matchUser) {
      return res.status(401).json({ msg: "Incorrect Password" });
    }

    // ✅ Include role in token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      "my-secret-key"
    );

    return res.status(200).json({ msg: "Login Successful", token });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

module.exports = {
  addUsers,
  getUsers,
  updateUser,
  deleteUser,
  loginUser,
  getUserProfile,
};
