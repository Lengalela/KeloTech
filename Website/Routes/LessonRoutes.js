// LessonRoutes.js
const express = require("express");
const router = express.Router();
const pool = require("../database");

// GET all lessons for a specific course, grouped by level
router.get("/courses/:courseId/lessons", async (req, res) => {
  const courseId = req.params.courseId;
  try {
    const result = await pool.query(
      "SELECT * FROM lessons WHERE course_id = $1 ORDER BY level, order_number ASC",
      [courseId]
    );
    // Optionally group lessons by level in the backend:
    const groupedLessons = { Beginner: [], Intermediate: [], Advanced: [] };
    result.rows.forEach(lesson => {
      groupedLessons[lesson.level].push(lesson);
    });
    res.json(groupedLessons);
  } catch (err) {
    console.error("Error retrieving lessons", err);
    res.status(500).json({ error: "Database error" });
  }
});

// POST a new lesson for a course
router.post("/courses/:courseId/lessons", async (req, res) => {
  const courseId = req.params.courseId;
  const { title, level, content, order_number } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO lessons (course_id, title, level, content, order_number) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [courseId, title, level, content, order_number]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error creating lesson", err);
    res.status(500).json({ error: "Database error" });
  }
});

// Additional endpoints (update, delete) may be added here as needed

module.exports = router;
