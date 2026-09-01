const express = require("express");
const {
  validateCreateTask,
  validateUpdateTask,
} = require("../middleware/validation");

const taskController = require("../controllers/taskController");

const router = express.Router();

//stats
router.get("/stats", taskController.getStats);

//RESET
router.post("/reset", taskController.resetTasks);

// GET all tasks
router.get("/tasks", taskController.getAllTasks);

// GET task by ID
router.get("/tasks/:id", taskController.getTaskById);

// CREATE task
router.post("/tasks", validateCreateTask, taskController.createTask);

// UPDATE task
router.put("/tasks/:id", validateUpdateTask, taskController.updateTask);

// DELETE task
router.delete("/tasks/:id", taskController.deleteTask);

module.exports = router;
