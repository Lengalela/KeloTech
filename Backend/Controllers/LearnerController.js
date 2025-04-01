const bcrypt = require("bcrypt");
const pool = require("../database");
const jwt = require("jsonwebtoken");
const { registerLearnerSchema, loginLearnerSchema } = require("../validation");

const registerLearner = async (req, res) => {
  const { error } = registerLearnerSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { first_name, last_name, username, school, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      `INSERT INTO learners (first_name, last_name, username, school, email, password_hash)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING learner_id, first_name, last_name, username, email, school`,
      [first_name, last_name, username, school, email, hashedPassword]
    );

    res.status(201).json({
      message: "Learner registered successfully",
      learner: result.rows[0],
    });
  } catch (err) {
    if (err.code === "23505") {
      const conflictField = err.constraint.includes("username") ? "Username" : "Email";
      return res.status(409).json({ error: `${conflictField} already exists.` });
    }
    console.error("Error registering learner:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const loginLearner = async (req, res) => {
  const { error } = loginLearnerSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { username, password } = req.body;

  try {
    const result = await pool.query("SELECT * FROM learners WHERE username = $1", [username]);
    if (result.rowCount === 0) return res.status(404).json({ error: "Learner not found" });

    const learner = result.rows[0];
    const isPasswordValid = await bcrypt.compare(password, learner.password_hash);
    if (!isPasswordValid) return res.status(401).json({ error: "Invalid password" });

    const token = jwt.sign({ id: learner.learner_id }, process.env.SECRET_KEY, { expiresIn: "5h" });

    res.json({ message: "Login successful", token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { registerLearner, loginLearner };
