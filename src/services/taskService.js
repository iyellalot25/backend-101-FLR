const taskRepository = require("../repositories/taskRepository");

//stats
async function getStats() {
  return await taskRepository.getStats();
}

//RESET
async function resetTasks() {
  return await taskRepository.reset();
}

// Get all tasks - Default parameter for optional parameters
async function getAllTasks(options = {}) {
  const { done, search, limit, offset, sort, order } = options; //destructure from options

  return await taskRepository.getAllTasks({
    done,
    search,
    limit,
    offset,
    sort,
    order,
  });
}

// Get task by ID
async function getTaskById(id) {
  return await taskRepository.findById(id);
}

// Create task
async function createTask(title) {
  const cleanTitle = String(title).trim();

  return await taskRepository.create(cleanTitle);
}

// Update task
async function updateTask(id, title, done) {
  const task = await taskRepository.findById(id);

  if (!task) {
    return null;
  }

  const updatedTitle = title !== undefined ? String(title).trim() : task.title;
  const updatedDone = done !== undefined ? done : task.done;

  return await taskRepository.update(id, updatedTitle, updatedDone);
}

// Delete task
async function deleteTask(id) {
  return await taskRepository.remove(id);
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
