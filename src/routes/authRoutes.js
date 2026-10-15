const express = require("express");
const supabase = require("../config/supabase");

const router = express.Router();

// POST /auth/signup
router.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      error: "Email and password are required",
    });
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    return res.status(400).json({
      error: error.message,
    });
  }

  res.status(201).json({
    message: "Signup successful",
    user: data.user,
  });
});

// POST /auth/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      error: "Email and password are required",
    });
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.session) {
    return res.status(401).json({
      error: error?.message || "Login failed",
    });
  }

  res.status(200).json({
    message: "Login successful",
    access_token: data.session.access_token,
    refresh_token: data.session.refresh_token,
    user: data.user,
  });
});

// POST /auth/logout
router.post("/logout", async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      error: "Missing or malformed authorization token",
    });
  }

  const token = authHeader.slice(7).trim();

  if (!token || token.split(/\s+/).length !== 1) {
    return res.status(401).json({
      error: "Missing or malformed authorization token",
    });
  }

  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data.user) {
    return res.status(401).json({
      error: "Invalid or expired token",
    });
  }

  const { createClient } = require("@supabase/supabase-js");

  const userClient = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY,
    {
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    },
  );

  const { error: logoutError } = await userClient.auth.signOut({
    scope: "global",
  });

  if (logoutError) {
    return res.status(500).json({
      error: "Logout failed",
    });
  }

  return res.status(204).send();
});

module.exports = router;
