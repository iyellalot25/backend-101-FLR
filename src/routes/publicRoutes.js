const express = require("express");

const router = express.Router();

// GET /public/info
router.get("/info", (req, res) => {
  res.status(200).json({
    message: "This is public information",
    authenticated: false,
  });
});

module.exports = router;
