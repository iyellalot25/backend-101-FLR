require("dotenv").config();

const app = require("./src/app");
const { initializeDatabase } = require("./src/repositories/database");

const port = 3000;

async function startServer() {
  try {
    await initializeDatabase();

    app.listen(port, () => {
      console.log(`Task app listening on port: ${port}`);
    });
  } catch (error) {
    console.error("Database initialization failed:", error);
    process.exit(1);
  }
}

startServer();
