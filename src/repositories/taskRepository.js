const { pool } = require("./database");

// Stats
async function getStats() {
  const totalResult = await pool.query("SELECT COUNT(*) AS count FROM tasks");

  const doneResult = await pool.query(
    "SELECT COUNT(*) AS count FROM tasks WHERE done = TRUE",
  );

  const openResult = await pool.query(
    "SELECT COUNT(*) AS count FROM tasks WHERE done = FALSE",
  );

  return {
    total: Number(totalResult.rows[0].count),
    done: Number(doneResult.rows[0].count),
    open: Number(openResult.rows[0].count),
  };
}

// RESET
async function reset() {
  await pool.query("DELETE FROM tasks");

  await pool.query(`
    INSERT INTO tasks (title, done)
    VALUES
      ('Buy groceries', FALSE),
      ('Walk the dog', TRUE),
      ('Read a book', FALSE)
  `);

  return getAllTasks();
}

// Map PostgreSQL task to API response
function mapTask(task) {
  if (!task) {
    return task;
  }

  return {
    ...task, //Spread the existing object
    done: Boolean(task.done),
  };
}

// Get all tasks
async function getAllTasks(options = {}) {
  const { done, search, limit, offset, sort, order } = options;

  let query = "SELECT * FROM tasks";
  const conditions = [];
  const params = [];

  // Filter by completion status
  if (done !== undefined) {
    params.push(done === "true");
    conditions.push(`done = $${params.length}`);
  }

  // Search by title
  if (search !== undefined) {
    params.push(`%${search}%`);
    conditions.push(`title ILIKE $${params.length}`);
  }

  // Add WHERE conditions
  if (conditions.length > 0) {
    query += " WHERE " + conditions.join(" AND ");
  }

  // Sorting
  if (sort === "title") {
    const sortOrder = order === "desc" ? "DESC" : "ASC";
    query += ` ORDER BY title ${sortOrder}`;
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

    params.push(parsedLimit);
    query += ` LIMIT $${params.length}`;

    params.push(start);
    query += ` OFFSET $${params.length}`;
  }

  const result = await pool.query(query, params);

  return result.rows.map(mapTask);
}

// Find a task by ID
async function findById(id) {
  const result = await pool.query("SELECT * FROM tasks WHERE id = $1", [id]);

  return mapTask(result.rows[0]);
}

// Add a task
async function create(title) {
  const result = await pool.query(
    `
      INSERT INTO tasks (title, done)
      VALUES ($1, $2)
      RETURNING *
    `,
    [title, false],
  );

  return mapTask(result.rows[0]);
}

// Update a task
async function update(id, title, done) {
  const result = await pool.query(
    `
      UPDATE tasks
      SET title = $1,
          done = $2,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
      RETURNING *
    `,
    [title, done, id],
  );

  if (result.rows.length === 0) {
    return null;
  }

  return mapTask(result.rows[0]);
}

// Remove a task
async function remove(id) {
  const result = await pool.query("DELETE FROM tasks WHERE id = $1", [id]);

  return result.rowCount > 0;
}

module.exports = {
  getStats,
  reset,
  getAllTasks,
  findById,
  create,
  update,
  remove,
};
