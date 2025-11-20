import { Request, Response } from "express";
import { DutyModel } from "../models/duty.model";
import { CreateDutyRequest, UpdateDutyRequest } from "../types/duty";

export class DutyController {
  /**
   * Get all duties
   */
  static async getAll(_req: Request, res: Response): Promise<void> {
    try {
      const duties = await DutyModel.findAll();
      res.status(200).json(duties);
    } catch (error) {
      console.error("Error fetching duties:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  /**
   * Create a new duty
   */
  static async create(req: Request, res: Response): Promise<void> {
    try {
      const { name }: CreateDutyRequest = req.body;

      if (!name || typeof name !== "string" || name.trim().length === 0) {
        res
          .status(400)
          .json({ error: "Name is required and must be a non-empty string" });
        return;
      }

      if (name.length > 255) {
        res.status(400).json({ error: "Name must be 255 characters or less" });
        return;
      }

      const duty = await DutyModel.create({ name: name.trim() });
      res.status(201).json(duty);
    } catch (error) {
      console.error("Error creating duty:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  /**
   * Update a duty by ID
   */
  static async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { name }: UpdateDutyRequest = req.body;

      if (!name || typeof name !== "string" || name.trim().length === 0) {
        res
          .status(400)
          .json({ error: "Name is required and must be a non-empty string" });
        return;
      }

      if (name.length > 255) {
        res.status(400).json({ error: "Name must be 255 characters or less" });
        return;
      }

      const duty = await DutyModel.update(id, { name: name.trim() });

      if (!duty) {
        res.status(404).json({ error: "Duty not found" });
        return;
      }

      res.status(200).json(duty);
    } catch (error) {
      console.error("Error updating duty:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  /**
   * Delete a duty by ID
   */
  static async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const deleted = await DutyModel.delete(id);

      if (!deleted) {
        res.status(404).json({ error: "Duty not found" });
        return;
      }

      res.status(204).send();
    } catch (error) {
      console.error("Error deleting duty:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}
