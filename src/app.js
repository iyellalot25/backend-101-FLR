const express = require("express");
const swaggerUi = require("swagger-ui-express");
const openapi = require("../openapi.json");
const taskRoutes = require("./routes/taskRoutes");
const publicRoutes = require("./routes/publicRoutes");
const protectedRoutes = require("./routes/protectedRoutes");
const errorHandler = require("./middleware/errorHandler");
const notFound = require("./middleware/notFound");
const { pool } = require("./repositories/database");
const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(express.json());

// Stage 5 - Swagger UI at /docs
app.use("/docs", swaggerUi.serve, swaggerUi.setup(openapi));

// Stage 1

// Root endpoint
app.get("/", (req, res) => {
  res.status(200);

  res.json({
    name: "Task API",
    version: "1.0",
    endpoints: ["/tasks", "/stats", "/reset", "/docs"],
  });
});

// Health Check
app.get("/health", async (req, res) => {
  try {
    await pool.query("SELECT 1");

    res.status(200).json({
      status: "ok",
      db: "ok",
    });
  } catch (error) {
    res.status(503).json({
      status: "error",
      db: "error",
    });
  }
});

// Auth routes
app.use("/auth", authRoutes);

// Public routes
app.use("/public", publicRoutes);

// Protected routes
app.use("/protected", protectedRoutes);

// Task routes
app.use("/", taskRoutes);

// Custom 404 handler
app.use(notFound);

// Centralized error handler
app.use(errorHandler);

module.exports = app;
