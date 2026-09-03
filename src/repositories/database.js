const Database = require("better-sqlite3");

//Create/open db
const db = new Database("tasks.db");

//Create the table on the first run - safe to call everytime - IF NOT EXISTS
db.exec(`
    CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        done INTEGER NOT NULL DEFAULT 0,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
`);

//Indexing
db.exec(`
    CREATE INDEX IF NOT EXISTS idx_tasks_done
    ON tasks(done)
`);

const count = db.prepare("SELECT COUNT(*) AS count FROM tasks").get();

//Prevents duplication
if (count.count === 0) {
  const insert = db.prepare(`
        INSERT INTO tasks (title, done)
        VALUES (?, ?)
    `);
  //Using a transaction here so that the three inserts as treated as one operation. ACID
  const seedTasks = db.transaction(() => {
    insert.run("Buy groceries", 0);
    insert.run("Walk the dog", 1);
    insert.run("Read a book", 0);
  });

  seedTasks();
}

module.exports = db;
