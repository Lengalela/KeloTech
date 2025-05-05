const bcrypt = require("bcrypt");
const pool = require("../database");
const jwt = require("jsonwebtoken");
const { registerLearnerSchema,loginLearnerSchema } = require("../validation");

const registerLearner = async (req, res) => {
  const { first_name, last_name, username, school, email, password } = req.body;

  try {
    // 1) Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 2) Call create_learner function
    const result = await pool.query(
      "SELECT * FROM create_learner($1, $2, $3, $4, $5, $6)",
      [first_name, last_name, username, school, email, hashedPassword]
    );

    // 3) If no exception => success
    return res.status(201).json({
      message: "Learner registered successfully",
      learner: result.rows[0],
    });
  } catch (err) {
    if (err.code === "P0101") {
      // Duplicate username
      return res.status(409).json({ error: "Username already exists" });
    } else if (err.code === "P0102") {
      // Duplicate email
      return res.status(409).json({ error: "Email already exists" });
    }

    // Other errors
    console.error("Error registering learner:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { registerLearner };
const loginLearner = async (req, res) => {
  // 1) Validate input
  const { error } = loginLearnerSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { username, password } = req.body;

  try {
    // 2) Fetch the user from DB by username
    const result = await pool.query(
      "SELECT * FROM learners WHERE username = $1",
      [username]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Learner not found" });
    }

    const learner = result.rows[0];

    // 3) Compare user’s input `password` with stored `learner.password_hash`
    const isPasswordValid = await bcrypt.compare(password, learner.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid password" });
    }

    // 4) If valid, generate a JWT token
    const token = jwt.sign({ id: learner.learner_id }, process.env.SECRET_KEY, {
      expiresIn: "5h",
    });

    res.json({ message: "Login successful", token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
const getLearnerProfile = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT learner_id, username, first_name, last_name FROM learners WHERE learner_id = $1",
      [req.user.id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Learner not found" });
    }
    res.json({
      message: "Authenticated",
      learner: result.rows[0],
    });
  } catch (error) {
    console.error("Profile retrieval error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getLearnerProfileSimple = async (req, res) => {
  try {
    const learnerId = req.user.id;

    const result = await pool.query(
      `SELECT learner_id, first_name, last_name, username, email, school, created_at
       FROM learners
       WHERE learner_id = $1`,
      [learnerId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Learner not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching learner profile:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { registerLearner, loginLearner, getLearnerProfile, getLearnerProfileSimple};