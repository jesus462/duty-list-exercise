/**
 * SQL queries for the Duty model
 * Centralized location for all database queries related to duties
 */

export const DUTY_QUERIES = {
  /**
   * Get all duties ordered by creation date (newest first)
   */
  FIND_ALL: "SELECT id, name FROM duties ORDER BY created_at DESC",

  /**
   * Create a new duty
   */
  CREATE: "INSERT INTO duties (name) VALUES ($1) RETURNING id, name",

  /**
   * Update a duty by ID
   */
  UPDATE: "UPDATE duties SET name = $1 WHERE id = $2 RETURNING id, name",

  /**
   * Delete a duty by ID
   */
  DELETE: "DELETE FROM duties WHERE id = $1",
} as const;
