import { database } from "../config/database";

/**
 * Sets up and tests the database connection on application startup
 * Logs connection status and handles connection errors
 * Does not exit the process on failure to allow the app to start
 */
export const setupDatabase = async (): Promise<void> => {
  try {
    await database.testConnection();
  } catch (err) {
    console.error("Failed to connect to database");
  }
};
