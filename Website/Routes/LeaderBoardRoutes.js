// routes/LeaderboardRoutes.js
const express = require('express');
const router  = express.Router();
const pool    = require('../database');

// GET /api/leaderboard
// Returns every learner with total quiz-score (sum of percentages) 
// plus counts of gold/silver/bronze badges.
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        l.learner_id,
        l.username,
        l.first_name,
        l.last_name,
        COALESCE(SUM((qm.value)::int),0) AS total_score,
        COALESCE(SUM(CASE WHEN (qm.value)::int BETWEEN 90 AND 100 THEN 1 ELSE 0 END),0) AS gold_count,
        COALESCE(SUM(CASE WHEN (qm.value)::int BETWEEN 80 AND 89  THEN 1 ELSE 0 END),0) AS silver_count,
        COALESCE(SUM(CASE WHEN (qm.value)::int BETWEEN 70 AND 79  THEN 1 ELSE 0 END),0) AS bronze_count
      FROM learners l
      LEFT JOIN enrollments e 
        ON e.learner_id = l.learner_id
      LEFT JOIN LATERAL 
        jsonb_each_text(e.quiz_marks) AS qm(key, value) ON TRUE
      GROUP BY 
        l.learner_id, l.username, l.first_name, l.last_name
      ORDER BY 
        total_score DESC, l.username ASC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching leaderboard', err);
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;
