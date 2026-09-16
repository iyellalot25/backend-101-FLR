require("dotenv").config();

const app = require("./src/app");
const supabase = require("./src/config/supabase");
const {
  initializeDatabase,
  initializeRedis,
} = require("./src/repositories/database");

const port = process.env.PORT || 3000;

async function startServer() {
  try {
    await initializeDatabase();
    await initializeRedis();

    // Verify Supabase client configuration
    if (!supabase) {
      throw new Error("Supabase client initialization failed");
    }

    app.listen(port, () => {
      console.log(`Task app listening on port: ${port}`);
      console.log("Supabase client initialized");
    });
  } catch (error) {
    console.error("Server initialization failed:", error);
    process.exit(1);
  }
}

startServer();
