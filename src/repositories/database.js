const { Pool } = require("pg");
const { createClient } = require("redis");

// Create/open PostgreSQL pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Create Redis client
const redisClient = createClient({
  url: process.env.REDIS_URL,
});

redisClient.on("error", (error) => {
  console.error("Redis error:", error);
});

// Create the table on the first run - safe to call every time - IF NOT EXISTS
async function initializeDatabase() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS tasks (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      done BOOLEAN NOT NULL DEFAULT FALSE,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Index the column used by the completion-status filter
  await pool.query(`
    CREATE INDEX IF NOT EXISTS idx_tasks_done
    ON tasks(done)
  `);

  const countResult = await pool.query("SELECT COUNT(*) AS count FROM tasks");

  // Seed protection prevents duplication
  if (Number(countResult.rows[0].count) === 0) {
    await pool.query(`
      INSERT INTO tasks (title, done)
      VALUES
        ('Buy groceries', FALSE),
        ('Walk the dog', TRUE),
        ('Read a book', FALSE)
    `);
  }
}

// Connect to Redis and verify it responds
async function initializeRedis() {
  await redisClient.connect();

  const response = await redisClient.ping();
  console.log(`Redis: ${response}`);
}

module.exports = {
  pool,
  redisClient,
  initializeDatabase,
  initializeRedis,
};
