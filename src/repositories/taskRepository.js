const { tasks } = require("../data/tasks");
const db = require("./database");

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

//Map tasks done status from 0/1 to booleans
function mapTask(task) {
  if (!task) {
    return task;
  }

  return {
    ...task, //Spread(copy existing) task object and then change done attribute
    done: Boolean(task.done),
  };
}

// Get all tasks
function getAllTasks() {
  const tasks = db.prepare("SELECT * FROM tasks").all();

  return tasks.map(mapTask);
}

// Find a task by ID
function findById(id) {
  const task = db.prepare("SELECT * FROM tasks WHERE id = ?").get(id);

  return mapTask(task);
}

// Find the index of a task (NOT NEEDED ANYMORE)
function findIndexById(id) {
  return tasks.findIndex((t) => t.id === id);
}

// Get the next available ID (NOT NEEDED SQLite AUTOINCREMENT HANDLES ID GEN)
function getNextId() {
  return tasks.length === 0 ? 1 : Math.max(...tasks.map((t) => t.id)) + 1;
}

// Add a task
function create(title) {
  const result = db
    .prepare(
      `
      INSERT INTO tasks (title, done)
      VALUES (?, ?)
    `,
    )
    .run(title, 0);

  return findById(result.lastInsertRowid);
}

// Update a task
function update(id, title, done) {
  const result = db
    .prepare(
      `
      UPDATE tasks
      SET title = ?, done = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `,
    )
    .run(title, done ? 1 : 0, id);

  if (result.changes === 0) {
    return null;
  }

  return findById(id);
}

// Remove a task
function remove(id) {
  const result = db.prepare("DELETE FROM tasks WHERE id = ?").run(id);

  return result.changes > 0;
}

module.exports = {
  getStats,
  reset,
  getAllTasks,
  findById,
  findIndexById,
  getNextId,
  create,
  update,
  remove,
};
