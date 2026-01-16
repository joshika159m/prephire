const express = require("express");
const upload = require("../config/multer");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const db = require("../db");
const path = require("path");
const fs = require("fs");
const sendReviewEmail = require("../utils/email");


const router = express.Router();

/* ================= UPLOAD RESUME ================= */
router.post(
  "/upload",
  authMiddleware,
  upload.single("resume"),
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const sql =
      "INSERT INTO resumes (user_id, filename, status) VALUES (?, ?, 'PENDING')";

    db.query(sql, [req.user.id, req.file.filename], (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Database error" });
      }

      res.status(201).json({
        message: "Resume uploaded",
        resumeId: result.insertId,
      });
    });
  }
);

/* ================= ADMIN: VIEW ALL ================= */
router.get(
  "/all",
  authMiddleware,
  adminMiddleware,
  (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const offset = (page - 1) * limit;

    const countSql = "SELECT COUNT(*) AS total FROM resumes";
    const dataSql = `
      SELECT 
        resumes.id,
        resumes.filename,
        resumes.status,
        resumes.decision,
        resumes.feedback,
        resumes.uploaded_at,
        users.email
      FROM resumes
      JOIN users ON resumes.user_id = users.id
      ORDER BY resumes.uploaded_at DESC
      LIMIT ? OFFSET ?
    `;

    db.query(countSql, (err, countResult) => {
      if (err) {
        return res.status(500).json({ message: "Database error" });
      }

      const totalCount = countResult[0].total;
      const totalPages = Math.ceil(totalCount / limit);

      db.query(dataSql, [limit, offset], (err, results) => {
        if (err) {
          return res.status(500).json({ message: "Database error" });
        }

        res.json({
          data: results,
          page,
          totalPages,
          totalCount,
        });
      });
    });
  }
);


/* ================= ADMIN: DOWNLOAD ================= */
router.get(
  "/download/:id",
  authMiddleware,
  adminMiddleware,
  (req, res) => {
    const sql = "SELECT filename FROM resumes WHERE id = ?";

    db.query(sql, [req.params.id], (err, results) => {
      if (err || results.length === 0) {
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

/* ================= ADMIN: REVIEW ================= */
router.patch(
  "/:id/review",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    const resumeId = req.params.id;
    const { decision, feedback } = req.body;

    if (!decision) {
      return res.status(400).json({ message: "Decision required" });
    }

    const updateSql = `
      UPDATE resumes
      SET status = 'REVIEWED',
          decision = ?,
          feedback = ?,
          reviewed_at = NOW()
      WHERE id = ?
    `;

    db.query(updateSql, [decision, feedback || null, resumeId], async (err) => {
      if (err) {
        return res.status(500).json({ message: "Database error" });
      }

      const userSql = `
        SELECT users.email
        FROM resumes
        JOIN users ON resumes.user_id = users.id
        WHERE resumes.id = ?
      `;

      db.query(userSql, [resumeId], async (err, result) => {
        if (!err && result.length > 0) {
          try {
            await sendReviewEmail({
              to: result[0].email,
              decision,
              feedback,
            });
          } catch (e) {
            console.error("Email failed:", e.message);
          }
        }
      });

      res.json({ message: "Resume reviewed successfully" });
    });
  }
);


/* ================= USER: MY RESUMES ================= */
router.get(
  "/my",
  authMiddleware,
  (req, res) => {
    const sql = `
      SELECT id, filename, status, decision, feedback, uploaded_at
      FROM resumes
      WHERE user_id = ?
      ORDER BY uploaded_at DESC
    `;

    db.query(sql, [req.user.id], (err, results) => {
      if (err) {
        return res.status(500).json({ message: "Database error" });
      }
      res.json(results);
    });
  }
);

module.exports = router;
