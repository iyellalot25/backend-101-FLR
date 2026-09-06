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
  const { done, search, limit, offset } = options; //destructure from options

  return taskRepository.getAllTasks({
    done,
    search,
    limit,
    offset,
  });
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

  const updatedTitle = title !== undefined ? title.trim() : task.title;
  const updatedDone = done !== undefined ? done : task.done;

  return taskRepository.update(id, updatedTitle, updatedDone);
}

// Delete task
function deleteTask(id) {
  return taskRepository.remove(id);
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
