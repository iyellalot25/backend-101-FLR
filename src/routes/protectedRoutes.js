const express = require("express");

const router = express.Router();

// GET /protected/profile
router.get("/profile", async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      error: "Missing or malformed authorization token",
    });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      error: "Missing or malformed authorization token",
    });
  }

  res.status(200).json({
    message: "Token received",
    token_received: true,
  });
});

module.exports = router;
