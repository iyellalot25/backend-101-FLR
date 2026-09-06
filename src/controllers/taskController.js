const taskService = require("../services/taskService");
const ApiError = require("../errors/ApiError");

//stats
function getStats(req, res) {
  const stats = taskService.getStats();

  res.status(200);
  res.json(stats);
}

//RESET
function resetTasks(req, res) {
  const tasks = taskService.resetTasks();

  res.status(200);
  res.json(tasks);
}

// GET all tasks
function getAllTasks(req, res) {
  const { done, search, limit, offset, sort, order } = req.query; //destructure options from params
  const result = taskService.getAllTasks({
    done,
    search,
    limit,
    offset,
    sort,
    order,
  }); //Passing parameters inside an object to pass by name and make them flexible and optional

  res.status(200);
  res.json(result);
}

// GET task by ID
function getTaskById(req, res) {
  const id = Number(req.params.id);

  const task = taskService.getTaskById(id);

  if (!task) {
    throw new ApiError(404, `Task ${id} not found`);
  }

  res.status(200);
  res.json(task);
}

// CREATE task
function createTask(req, res) {
  const { title } = req.body;
  const newTask = taskService.createTask(title);

  res.status(201);
  res.json(newTask);
}

// UPDATE task
function updateTask(req, res) {
  const id = Number(req.params.id);
  const task = taskService.getTaskById(id);

  // Validation
  if (!task) {
    throw new ApiError(404, `Task ${id} not found`);
  }

  const { title, done } = req.body;
  const updatedTask = taskService.updateTask(id, title, done);

  res.status(200);
  res.json(updatedTask);
}

// DELETE task
function deleteTask(req, res) {
  const id = Number(req.params.id);

  const deleted = taskService.deleteTask(id);

  // Validation
  if (!deleted) {
    throw new ApiError(404, `Task ${id} not found`);
  }

  res.status(204).send();
}

module.exports = {
  getStats,
  resetTasks,
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
};
