const pool = require("../database");

// Get all courses
exports.getAllCourses = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM courses ORDER BY course_id");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve courses" });
  }
};

// Get lessons by course ID
exports.getLessonsByCourse = async (req, res) => {
  const { courseId } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM lessons WHERE course_id = $1 ORDER BY order_number",
      [courseId]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve lessons" });
  }
};

// Get single lesson by ID
exports.getLessonById = async (req, res) => {
  const { lessonId } = req.params;
  try {
    const result = await pool.query("SELECT * FROM lessons WHERE lesson_id = $1", [lessonId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Lesson not found" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve lesson" });
  }
};
