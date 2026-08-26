const express = require("express");

const swaggerUi = require("swagger-ui-express");

const openapi = require("../openapi.json");

const taskRoutes = require("./routes/taskRoutes");

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
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
  });
});

// Task routes
app.use("/", taskRoutes);

module.exports = app;
