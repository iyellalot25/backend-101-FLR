const express = require("express");
const authenticateToken = require("../middleware/authenticateToken");
const requireAdmin = require("../middleware/requireAdmin");

const router = express.Router();

// All routes require authentication
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

// GET /protected/admin
router.get("/admin", requireAdmin, (req, res) => {
  res.status(200).json({
    message: "Admin access granted",
    user_id: req.user.id,
  });
});

module.exports = router;
