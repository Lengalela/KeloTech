const jwt = require("jsonwebtoken");

const authenticateLearnerToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ error: "Access token missing" });

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("Token error:", err);
    res.status(403).json({ error: "Invalid or expired token" });
  }
};

module.exports = { authenticateLearnerToken };
