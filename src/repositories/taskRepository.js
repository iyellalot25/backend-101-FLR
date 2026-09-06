const { tasks } = require("../data/tasks");
const db = require("./database");

//stats
function getStats() {
  //Total
  const total = db.prepare("SELECT COUNT(*) AS count FROM tasks").get().count;

  //Done tasks
  const done = db
    .prepare("SELECT COUNT(*) AS count FROM tasks WHERE done = 1")
    .get().count;

  //Pending tasks
  const open = db
    .prepare("SELECT COUNT(*) AS count FROM tasks WHERE done = 0")
    .get().count;

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
function getAllTasks(options = {}) {
  const { done, search, limit, offset } = options;

  let query = "SELECT * FROM tasks";
  const conditions = [];
  const params = [];

  // Filter by completion status
  if (done !== undefined) {
    conditions.push("done = ?");
    params.push(done === "true" ? 1 : 0);
  }

  // Search by title
  if (search !== undefined) {
    conditions.push("title LIKE ?");
    params.push(`%${search}%`);
  }

  // Add WHERE conditions
  if (conditions.length > 0) {
    query += " WHERE " + conditions.join(" AND ");
  }

  //Pagination
  const parsedLimit = Number(limit);
  const parsedOffset = Number(offset);

  if (
    limit !== undefined &&
    Number.isInteger(parsedLimit) &&
    parsedLimit >= 0
  ) {
    const start =
      Number.isInteger(parsedOffset) && parsedOffset >= 0 ? parsedOffset : 0;

    query += " LIMIT ? OFFSET ?";
    params.push(parsedLimit, start);
  }

  const tasks = db.prepare(query).all(...params);

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
