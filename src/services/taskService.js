const taskRepository = require("../repositories/taskRepository");

// Get all tasks - Default parameter for optional parameters
function getAllTasks(options = {}) {
  let result = [...taskRepository.getAllTasks()];
  const { done, search } = options; //destructure from options

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

  return result;
}

// Get task by ID
function getTaskById(id) {
  return taskRepository.findById(id);
}

// Create task
function createTask(title) {
  const nextId = taskRepository.getNextId();

  const newTask = {
    id: nextId,
    title: String(title).trim(),
    done: false,
  };

  return taskRepository.create(newTask);
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
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
};
