const express = require("express");
const authenticateToken = require("../middleware/authenticateToken");

const router = express.Router();

//Use auth middleware
router.use(authenticateToken);

// GET /protected/profile
router.get("/profile", (req, res) => {
  res.status(200).json({
    message: "Authenticated successfully",
    user: {
      id: req.user.id,
      email: req.user.email,
      created_at: req.user.created_at,
    },
  });
});

// GET /protected/dashboard
router.get("/dashboard", (req, res) => {
  res.status(200).json({
    message: "Welcome to your protected dashboard",
    user_id: req.user.id,
  });
});

module.exports = router;
