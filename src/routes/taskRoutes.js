const express = require("express");

const taskController = require("../controllers/taskController");

const router = express.Router();

// GET all tasks
router.get("/tasks", taskController.getAllTasks);

// GET task by ID
router.get("/tasks/:id", taskController.getTaskById);

// CREATE task
router.post("/tasks", taskController.createTask);

// UPDATE task
router.put("/tasks/:id", taskController.updateTask);

// DELETE task
router.delete("/tasks/:id", taskController.deleteTask);

module.exports = router;
