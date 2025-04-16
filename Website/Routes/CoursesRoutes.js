// CoursesRoutes.js
const express = require("express");
const router = express.Router();
const pool = require("../database");

// GET all courses (e.g. "JavaScript", "Python", etc.)
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM courses ORDER BY course_id ASC");
    res.json(result.rows);
  } catch (err) {
    console.error("Error retrieving courses", err);
    res.status(500).json({ error: "Database error" });
  }
});

// GET a single course along with its lessons grouped by level
router.get("/:courseId", async (req, res) => {
  const courseId = req.params.courseId;
  try {
    // Fetch the course record
    const courseResult = await pool.query("SELECT * FROM courses WHERE course_id = $1", [courseId]);
    if (courseResult.rows.length === 0) {
      return res.status(404).json({ error: "Course not found" });
    }
    // Fetch lessons for this course, ordered by level and then order_number
    const lessonsResult = await pool.query(
      "SELECT * FROM lessons WHERE course_id = $1 ORDER BY level, order_number ASC",
      [courseId]
    );
    // Group lessons by level
    const groupedLessons = { Beginner: [], Intermediate: [], Advanced: [] };
    lessonsResult.rows.forEach(lesson => {
      groupedLessons[lesson.level].push(lesson);
    });
    const courseData = courseResult.rows[0];
    courseData.lessons = groupedLessons;
    res.json(courseData);
  } catch (err) {
    console.error("Error retrieving course data", err);
    res.status(500).json({ error: "Database error" });
  }
});

// POST a new course (for example, to add another subject)
router.post("/", async (req, res) => {
  const { title, description } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO courses (title, description) VALUES ($1, $2) RETURNING *",
      [title, description]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error creating course", err);
    res.status(500).json({ error: "Database error" });
  }
});

module.exports = router;
