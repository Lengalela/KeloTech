const express = require("express");
const router = express.Router();
const {
    registerLearner,
    loginLearner,
    getLearnerProfile,
    getLearnerProfileSimple
  } = require("../Controllers/LearnerController");
const { authenticateLearnerToken } = require("../Middleware/authMiddleware");

// Registration route
router.post("/register", registerLearner);

// Login route
router.post("/login", loginLearner);

// Profile route (protected)
router.get("/profile", authenticateLearnerToken, getLearnerProfile);

router.get("/profile-simple", authenticateLearnerToken, getLearnerProfileSimple);


module.exports = router;
