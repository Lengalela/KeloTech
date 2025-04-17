const express = require("express");
const router = express.Router();
const pool = require("../database"); // adjust the path as necessary

// GET all enrollments for a given learner (e.g. /api/enrollments/5/all)
router.get("/:learnerId/all", async (req, res) => {
  const { learnerId } = req.params;
  try {
    // Example query joining enrollments with courses
    const result = await pool.query(
      `SELECT e.*, 
              c.course_id, c.title, c.description 
       FROM enrollments e 
       JOIN courses c ON e.course_id = c.course_id 
       WHERE e.learner_id = $1 
       ORDER BY e.updated_at DESC`,
      [learnerId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error retrieving enrollments:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// GET a specific enrollment record by learner and course (e.g. /api/enrollments/5/2)
router.get("/:learnerId/:courseId", async (req, res) => {
  const { learnerId, courseId } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM enrollments WHERE learner_id = $1 AND course_id = $2",
      [learnerId, courseId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Enrollment not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error retrieving enrollment:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// POST a new enrollment (when a learner enrolls in a course)
router.post("/", async (req, res) => {
  const { learner_id, course_id, current_level, current_lesson } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO enrollments (learner_id, course_id, current_level, current_lesson) VALUES ($1, $2, $3, $4) RETURNING *",
      [learner_id, course_id, current_level, current_lesson]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error creating enrollment:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// PUT update an enrollment record (e.g., update progress, quiz marks, answers, feedback)
router.put("/:enrollmentId", async (req, res) => {
  const { enrollmentId } = req.params;
  const { current_level, current_lesson, quiz_marks, quiz_answers, ai_feedback } = req.body;
  try {
    const result = await pool.query(
      `UPDATE enrollments
       SET current_level = $1,
           current_lesson = $2,
           quiz_marks = $3,
           quiz_answers = $4,
           ai_feedback = $5,
           updated_at = CURRENT_TIMESTAMP
       WHERE enrollment_id = $6
       RETURNING *`,
      [current_level, current_lesson, quiz_marks, quiz_answers, ai_feedback, enrollmentId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Enrollment not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error updating enrollment:", err);
    res.status(500).json({ error: "Database error" });
  }
});

module.exports = router;
