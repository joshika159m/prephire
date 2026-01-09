const express = require("express");
const upload = require("../config/multer");
const authMiddleware = require("../middleware/authMiddleware");
const db = require("../db");

const router = express.Router();

router.post(
  "/upload",
  authMiddleware,
  upload.single("resume"),
(req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const sql =
    "INSERT INTO resumes (user_id, filename) VALUES (?, ?)";

  db.query(
    sql,
    [req.user.id, req.file.filename],
    (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Database error" });
      }

      res.status(201).json({
        message: "Resume uploaded and saved",
        resumeId: result.insertId
      });
    }
  );
}
);

module.exports = router;
