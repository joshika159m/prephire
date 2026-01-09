const express = require("express");
const authRoutes = require("./routes/authRoutes");
const authMiddleware = require("./middleware/authMiddleware");

const app = express();

app.use(express.json());

app.use("/api/auth", authRoutes);

app.get("/health", (req, res) => {
  res.json({ status: "Backend is running" });
});
app.get("/api/protected", authMiddleware, (req, res) => {
  res.json({
    message: "Access granted",
    user: req.user
  });
});
module.exports = app;

