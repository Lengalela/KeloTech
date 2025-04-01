const express = require("express");
const router = express.Router();
const { registerLearner, loginLearner } = require("../Controllers/LearnerController");
const { authenticateLearnerToken } = require("../Middleware/authMiddleware");

// ✅ Make sure these are actual functions and not undefined

router.post("/register", registerLearner); // ✅ FUNCTION
router.post("/login", loginLearner);       // ✅ FUNCTION

router.get("/profile", authenticateLearnerToken, (req, res) => {
  res.json({ message: "Authenticated", userId: req.user.id });
});

module.exports = router;
