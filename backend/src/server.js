import app from "./app.js";
import { connectDB } from "./config/db.js";
import { config } from "./config/env.js";

async function startServer() {
  try {
    await connectDB();

    app.listen(config.port, () => {
      console.log("🚀 EventIQ Backend Started");
      console.log(`🌍 Environment: ${config.nodeEnv}`);
      console.log(`📡 Server: http://localhost:${config.port}`);
      console.log(`❤️ Health: http://localhost:${config.port}/health`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
}

startServer();

/*
 Graceful shutdown
*/

process.on("SIGINT", () => {
  console.log("\n🛑 Shutting down server...");
  process.exit(0);
});