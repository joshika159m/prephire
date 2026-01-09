const express = require("express");
const upload = require("../config/multer");
const authMiddleware = require("../middleware/authMiddleware");
const db = require("../db");
const adminMiddleware = require("../middleware/adminMiddleware");


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

router.get(
  "/all",
  authMiddleware,
  adminMiddleware,
  (req, res) => {
    const sql = `
      SELECT resumes.id, resumes.filename, resumes.uploaded_at,
             users.id AS user_id, users.name, users.email
      FROM resumes
      JOIN users ON resumes.user_id = users.id
      ORDER BY resumes.uploaded_at DESC
    `;

    db.query(sql, (err, results) => {
      if (err) {
        return res.status(500).json({ message: "Database error" });
      }

      res.json(results);
    });
  }
);
const path = require("path");
const fs = require("fs");

router.get(
  "/download/:id",
  authMiddleware,
  adminMiddleware,
  (req, res) => {
    const resumeId = req.params.id;

    const sql = "SELECT filename FROM resumes WHERE id = ?";

    db.query(sql, [resumeId], (err, results) => {
      if (err) {
        return res.status(500).json({ message: "Database error" });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: "Resume not found" });
      }

      const filePath = path.join(
        __dirname,
        "../../uploads",
        results[0].filename
      );

      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ message: "File missing on server" });
      }

      res.download(filePath);
    });
  }
);



module.exports = router;
