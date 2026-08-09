const express = require("express");
const app = express();
const port = 3000;

app.use(express.json()); //Middleware to automatically parse json without needing to manually parse

//In-memory dummy tasks
const DUMMY_TASKS = [
  { id: 1, title: "Buy groceries", done: false },
  { id: 2, title: "Walk the dog", done: true },
  { id: 3, title: "Read a book", done: false },
];

const tasks = [...DUMMY_TASKS];

//Stage 1

//Root endpoint
app.get("/", (req, res) => {
  res.status(200);
  res.json({
    name: "Task API",
    version: "1.0",
    endpoints: ["/tasks", "/stats", "/reset", "/docs"],
  });
});

//Health Check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

//Stage 2

//GET all tasks
app.get("/tasks", (req, res) => {
  let result = [...tasks];
  res.status(200);
  res.json(tasks);
});

//GET tasks by ID
app.get("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  const task = tasks.find((t) => t.id === id);

  if (!task) {
    return res.status(404).json({ error: `Task ${id} not found` });
  }

  res.status(200);
  res.json(task);
});

app.listen(port, () => {
  console.log(`Task app listening on port: ${port}`);
});
