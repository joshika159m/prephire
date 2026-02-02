const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const resumeRoutes = require("./routes/resumeRoutes");

const authMiddleware = require("./middleware/authMiddleware");
const adminMiddleware = require("./middleware/adminMiddleware");

const app = express();

app.use(
  cors({
    origin: ["http://localhost:3000", "https://prephire.vercel.app"],
    credentials: true,
  }),
);

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/resume", resumeRoutes);

app.get("/health", (req, res) => {
  res.json({ status: "Backend is running" });
});

app.get("/api/protected", authMiddleware, (req, res) => {
  res.json({ message: "Access granted" });
});

app.get("/api/admin", authMiddleware, adminMiddleware, (req, res) => {
  res.json({ message: "Admin access granted" });
});

module.exports = app;
