import { DutyModel } from "../duty.model";
import pool from "../../config/database";
import { DUTY_QUERIES } from "../duty.queries";

jest.mock("../../config/database", () => ({
  __esModule: true,
  default: {
    query: jest.fn(),
  },
}));

describe("DutyModel", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("findAll", () => {
    it("should return all duties", async () => {
      const mockDuties = [
        { id: "1", name: "Test Duty 1" },
        { id: "2", name: "Test Duty 2" },
      ];

      (pool.query as jest.Mock).mockResolvedValue({ rows: mockDuties });

      const result = await DutyModel.findAll();

      expect(result).toEqual(mockDuties);
      expect(pool.query).toHaveBeenCalledWith(DUTY_QUERIES.FIND_ALL);
    });
  });

  describe("create", () => {
    it("should create a new duty", async () => {
      const newDuty = { id: "1", name: "New Duty" };

      (pool.query as jest.Mock).mockResolvedValue({ rows: [newDuty] });

      const result = await DutyModel.create({ name: "New Duty" });

      expect(result).toEqual(newDuty);
      expect(pool.query).toHaveBeenCalledWith(DUTY_QUERIES.CREATE, [
        "New Duty",
      ]);
    });
  });

  describe("update", () => {
    it("should update a duty", async () => {
      const updatedDuty = { id: "1", name: "Updated Duty" };

      (pool.query as jest.Mock).mockResolvedValue({ rows: [updatedDuty] });

      const result = await DutyModel.update("1", { name: "Updated Duty" });

      expect(result).toEqual(updatedDuty);
      expect(pool.query).toHaveBeenCalledWith(DUTY_QUERIES.UPDATE, [
        "Updated Duty",
        "1",
      ]);
    });

    it("should return null if duty not found", async () => {
      (pool.query as jest.Mock).mockResolvedValue({ rows: [] });

      const result = await DutyModel.update("1", { name: "Updated Duty" });

      expect(result).toBeNull();
    });
  });

  describe("delete", () => {
    it("should delete a duty", async () => {
      (pool.query as jest.Mock).mockResolvedValue({ rowCount: 1 });

      const result = await DutyModel.delete("1");

      expect(result).toBe(true);
      expect(pool.query).toHaveBeenCalledWith(DUTY_QUERIES.DELETE, ["1"]);
    });

    it("should return false if duty not found", async () => {
      (pool.query as jest.Mock).mockResolvedValue({ rowCount: 0 });

      const result = await DutyModel.delete("1");

      expect(result).toBe(false);
    });
  });
});
