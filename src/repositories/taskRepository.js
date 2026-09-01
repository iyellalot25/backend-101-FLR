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

//RESET
function reset() {
  tasks.length = 0;

  tasks.push(
    {
      id: 1,
      title: "Buy groceries",
      done: false,
    },
    {
      id: 2,
      title: "Walk the dog",
      done: true,
    },
    {
      id: 3,
      title: "Read a book",
      done: false,
    },
  );

  return tasks;
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
  reset,
  getAllTasks,
  findById,
  findIndexById,
  getNextId,
  create,
  remove,
};
