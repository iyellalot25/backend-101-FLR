const taskRepository = require("../repositories/taskRepository");

//stats
function getStats() {
  return taskRepository.getStats();
}

//RESET
function resetTasks() {
  return taskRepository.reset();
}

// Get all tasks - Default parameter for optional parameters
function getAllTasks(options = {}) {
  let result = [...taskRepository.getAllTasks()];
  const { done, search, limit, offset } = options; //destructure from options

  // Filtering
  if (done !== undefined) {
    const isDone = done === "true"; // converts string "true" to boolean true
    result = result.filter((task) => task.done === isDone);
  }

  // Search
  if (search !== undefined) {
    const searchText = search.toLowerCase();

    result = result.filter((task) =>
      task.title.toLowerCase().includes(searchText),
    );
  }

  // Pagination
  const parsedLimit = Number(limit);
  const parsedOffset = Number(offset);

  if (
    limit !== undefined &&
    Number.isInteger(parsedLimit) &&
    parsedLimit >= 0
  ) {
    const start =
      Number.isInteger(parsedOffset) && parsedOffset >= 0 ? parsedOffset : 0;

    result = result.slice(start, start + parsedLimit);
  }

  return result;
}

// Get task by ID
function getTaskById(id) {
  return taskRepository.findById(id);
}

// Create task
function createTask(title) {
  const cleanTitle = String(title).trim();

  return taskRepository.create(cleanTitle);
}

// Update task
function updateTask(id, title, done) {
  const task = taskRepository.findById(id);

  if (!task) {
    return null;
  }

  if (title !== undefined) {
    task.title = title.trim();
  }

  if (done !== undefined) {
    task.done = done;
  }

  return task;
}

// Delete task
function deleteTask(id) {
  const index = taskRepository.findIndexById(id);

  if (index === -1) {
    return false;
  }

  taskRepository.remove(index);

  return true;
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
