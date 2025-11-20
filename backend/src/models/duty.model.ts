import pool from "../config/database";
import { Duty, CreateDutyRequest, UpdateDutyRequest } from "../types/duty";
import { DUTY_QUERIES } from "./duty.queries";

export class DutyModel {
  /**
   * Get all duties
   */
  static async findAll(): Promise<Duty[]> {
    const result = await pool.query(DUTY_QUERIES.FIND_ALL);
    return result.rows;
  }

  /**
   * Create a new duty
   */
  static async create(data: CreateDutyRequest): Promise<Duty> {
    const result = await pool.query(DUTY_QUERIES.CREATE, [data.name]);
    return result.rows[0];
  }

  /**
   * Update a duty by ID
   */
  static async update(
    id: string,
    data: UpdateDutyRequest
  ): Promise<Duty | null> {
    const result = await pool.query(DUTY_QUERIES.UPDATE, [data.name, id]);
    return result.rows.length > 0 ? result.rows[0] : null;
  }

  /**
   * Delete a duty by ID (optional requirement)
   */
  static async delete(id: string): Promise<boolean> {
    const result = await pool.query(DUTY_QUERIES.DELETE, [id]);
    return result.rowCount !== null && result.rowCount > 0;
  }
}
