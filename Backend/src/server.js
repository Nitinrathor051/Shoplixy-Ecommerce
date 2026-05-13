require("dotenv").config(); // 🔥 load env variables

const express = require("express");
const mongoose = require("mongoose");
const route = require("./routes/route");
const cors = require("cors");

const app = express();

// 🔥 CORS CONFIG (PRODUCTION READY)
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://shoplixy-ecommerce-cm2q.vercel.app"
    ],
    credentials: true,
  })
);

// Middleware
app.use(express.json());

// ✅ API routes
app.use("/api", route);

// Health check route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Database Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB is Connected"))
  .catch((err) => {
    console.log("DB Connection Failed:", err.message);
  });

// Server start
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server is Running At Port ${PORT}`);
});
