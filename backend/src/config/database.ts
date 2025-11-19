import { Pool, PoolConfig } from "pg";
import dotenv from "dotenv";

dotenv.config();

/**
 * Database singleton class
 */
class Database {
  private static instance: Database | null = null;
  private pool: Pool | null = null;

  private constructor() {}

  /**
   * Get the singleton database instance
   * @returns The singleton Database instance
   */
  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  /**
   * Get the connection pool
   * @returns The PostgreSQL connection pool
   */
  public getPool(): Pool {
    if (!this.pool) {
      const dbConfig: PoolConfig = {
        host: process.env.DB_HOST || "localhost",
        port: parseInt(process.env.POSTGRES_PORT || "5432", 10),
        user: process.env.POSTGRES_USER || "postgres",
        password: process.env.POSTGRES_PASSWORD || "postgres",
        database: process.env.POSTGRES_DB || "duties_list_db",
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
      };

      this.pool = new Pool(dbConfig);

      this.pool.on("error", (err: Error) => {
        console.error("Unexpected error on idle client", err);
        process.exit(1);
      });
    }
    return this.pool;
  }

  /**
   * Test database connection
   * Verifies that the database is accessible
   * @throws Error if connection fails
   */
  public async testConnection(): Promise<void> {
    try {
      await this.getPool().query("SELECT NOW()");
      console.log("Database connected successfully");
    } catch (err) {
      console.error("Database connection error:", err);
      throw err;
    }
  }

  /**
   * Close database connections
   */
  public async close(): Promise<void> {
    if (this.pool) {
      await this.pool.end();
      this.pool = null;
      console.log("Database connections closed");
    }
  }
}

const database = Database.getInstance();

export default database.getPool();

export { database };
