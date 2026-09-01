const { tasks } = require("../data/tasks");

//stats
function getStats() {
  const total = tasks.length;
  const done = tasks.filter((task) => task.done === true).length;
  const open = tasks.filter((task) => task.done === false).length;
  return {
    total,
    done,
    open,
  };
}

// Get all tasks
function getAllTasks() {
  return tasks;
}

// Find a task by ID
function findById(id) {
  return tasks.find((t) => t.id === id);
}

// Find the index of a task
function findIndexById(id) {
  return tasks.findIndex((t) => t.id === id);
}

// Get the next available ID
function getNextId() {
  return tasks.length === 0 ? 1 : Math.max(...tasks.map((t) => t.id)) + 1;
}

// Add a task
function create(task) {
  tasks.push(task);
  return task;
}

// Remove a task
function remove(index) {
  tasks.splice(index, 1);
}

module.exports = {
  getStats,
  getAllTasks,
  findById,
  findIndexById,
  getNextId,
  create,
  remove,
};
