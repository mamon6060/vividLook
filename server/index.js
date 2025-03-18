require("dotenv").config();
const mongoose = require("mongoose");
const app = require("./app");

// 🎯 Handle Uncaught Exceptions (Synchronous Errors)
process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught Exception! Shutting down...", err);
  process.exit(1);
});

// const DB = process.env.DATABASE.replace(
//   "<PASSWORD>",
//   process.env.DATABASE_PASSWORD
// );

// 🌍 Connect to Database
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE);
    console.log(
      "\x1b[1m\x1b[37m✨✅ Database Connected Successfully! ✨\x1b[0m"
    );
  } catch (error) {
    console.error("\x1b[31m❌ Database Connection Failed!\x1b[0m", error);
    process.exit(1);
  }
};

connectDB();

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`\x1b[1m\x1b[90m🚀 SERVER IS RUNNING ON PORT ${PORT} 🚀\x1b[0m`);
});

// 🛑 Handle Unhandled Promise Rejections (Asynchronous Errors)
process.on("unhandledRejection", (err) => {
  console.error("❌ Unhandled Rejection! Shutting down...", err);
  server.close(() => process.exit(1));
});

// 🛑 Graceful Shutdown on SIGTERM (e.g., Heroku, Docker, Kubernetes shutdown)
process.on("SIGTERM", () => {
  console.log(
    "\x1b[33m⚠️ SIGTERM received. Shutting down gracefully...\x1b[0m"
  );
  server.close(() => {
    console.log("\x1b[31m💀 Process terminated.\x1b[0m");
  });
});
