const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
    },

    contact: {
      type: Number,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    address: {
      type: String,
      required: true,
      trim: true,
    },

    gender: {
      type: String,
      enum: ["male", "female", "others"],
      required: true,
      lowercase: true,
    },

    age: {
      type: Number,
      required: true,
    },

    // 🔥 Role (already good)
    role: {
      type: String,
      enum: ["user", "seller", "admin"],
      default: "user",
    },

    // 🔥 NEW: Account status (for admin control)
    status: {
      type: String,
      enum: ["active", "suspended"],
      default: "active",
    },

    // 🔥 NEW: Track last login (useful for admin)
    lastLogin: {
      type: Date,
      default: null,
    },

    // 🔥 OPTIONAL: Profile image (UI enhancement)
    profilePic: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("user", userSchema);