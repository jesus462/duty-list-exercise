import { Server } from "http";
import { database } from "../config/database";

/**
 * Sets up controlled shutdown handlers for the application
 * Handles SIGTERM and SIGINT signals to ensure clean shutdown
 * @param server - The HTTP server instance to close
 */
export const setupControlledShutdown = (server: Server): void => {
  const gracefulShutdown = async (signal: string): Promise<void> => {
    console.log(`\n${signal} received. Starting controlled shutdown...`);

    server.close(() => {
      console.log("HTTP server closed");
    });

    try {
      await database.close();
    } catch (err) {
      console.error("Error closing database:", err);
    }

    process.exit(0);
  };

  // Register signal handlers
  process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
  process.on("SIGINT", () => gracefulShutdown("SIGINT"));
};
