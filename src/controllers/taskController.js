const taskService = require("../services/taskService");
const ApiError = require("../errors/ApiError");

//stats
async function getStats(req, res, next) {
  try {
    const stats = await taskService.getStats();

    res.status(200).json(stats);
  } catch (error) {
    next(error);
  }
}

//RESET
async function resetTasks(req, res, next) {
  try {
    const tasks = await taskService.resetTasks();

    res.status(200).json(tasks);
  } catch (error) {
    next(error);
  }
}

// GET all tasks
async function getAllTasks(req, res, next) {
  try {
    const { done, search, limit, offset, sort, order } = req.query;

    const tasks = await taskService.getAllTasks({
      done,
      search,
      limit,
      offset,
      sort,
      order,
    });

    res.status(200).json(tasks);
  } catch (error) {
    next(error);
  }
}

// GET task by ID
async function getTaskById(req, res, next) {
  try {
    const id = Number(req.params.id);

    const task = await taskService.getTaskById(id);

    if (!task) {
      throw new ApiError(404, `Task ${id} not found`);
    }

    res.status(200).json(task);
  } catch (error) {
    next(error);
  }
}

// CREATE task
async function createTask(req, res, next) {
  try {
    const { title } = req.body;
    const newTask = await taskService.createTask(title);

    res.status(201).json(newTask);
  } catch (error) {
    next(error);
  }
}

// UPDATE task
async function updateTask(req, res, next) {
  try {
    const id = Number(req.params.id);
    const task = await taskService.getTaskById(id);

    // Validation
    if (!task) {
      throw new ApiError(404, `Task ${id} not found`);
    }

    const { title, done } = req.body;
    const updatedTask = await taskService.updateTask(id, title, done);

    res.status(200).json(updatedTask);
  } catch (error) {
    next(error);
  }
}

// DELETE task
async function deleteTask(req, res, next) {
  try {
    const id = Number(req.params.id);

    const deleted = await taskService.deleteTask(id);

    // Validation
    if (!deleted) {
      throw new ApiError(404, `Task ${id} not found`);
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
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
