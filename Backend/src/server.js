require("dotenv").config(); // 🔥 load env variables

const express = require("express");
const mongoose = require("mongoose");
const route = require("./routes/route");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ✅ IMPORTANT: Add /api prefix
app.use("/api", route);

// Health / root route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Database Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB is Connected"))
  .catch((err) => {
    console.log("DB Connection Failed:", err.message);
  });

// Server Creation
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server is Running At Port ${PORT}`);
});