import { Request, Response } from "express";
import { DutyController } from "../duty.controller";
import { DutyModel } from "../../models/duty.model";

jest.mock("../../models/duty.model");

describe("DutyController", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockStatus: jest.Mock;
  let mockJson: jest.Mock;
  let mockSend: jest.Mock;

  beforeEach(() => {
    mockJson = jest.fn().mockReturnThis();
    mockSend = jest.fn().mockReturnThis();
    mockStatus = jest.fn().mockReturnValue({
      json: mockJson,
      send: mockSend,
    });

    mockResponse = {
      status: mockStatus,
      json: mockJson,
      send: mockSend,
    };

    mockRequest = {
      body: {},
      params: {},
    };

    // Clear all mocks
    jest.clearAllMocks();
  });

  describe("getAll", () => {
    it("should return all duties with status 200", async () => {
      const mockDuties = [
        { id: 1, name: "Duty 1" },
        { id: 2, name: "Duty 2" },
      ];

      (DutyModel.findAll as jest.Mock).mockResolvedValue(mockDuties);

      await DutyController.getAll(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(DutyModel.findAll).toHaveBeenCalledTimes(1);
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith(mockDuties);
    });

    it("should handle errors and return status 500", async () => {
      const error = new Error("Database error");
      (DutyModel.findAll as jest.Mock).mockRejectedValue(error);

      const consoleSpy = jest.spyOn(console, "error").mockImplementation();

      await DutyController.getAll(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(DutyModel.findAll).toHaveBeenCalledTimes(1);
      expect(consoleSpy).toHaveBeenCalledWith("Error fetching duties:", error);
      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        error: "Internal server error",
      });

      consoleSpy.mockRestore();
    });
  });

  describe("create", () => {
    it("should create a duty with valid name and return status 201", async () => {
      const newDuty = { id: 1, name: "New Duty" };
      mockRequest.body = { name: "New Duty" };

      (DutyModel.create as jest.Mock).mockResolvedValue(newDuty);

      await DutyController.create(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(DutyModel.create).toHaveBeenCalledWith({ name: "New Duty" });
      expect(mockStatus).toHaveBeenCalledWith(201);
      expect(mockJson).toHaveBeenCalledWith(newDuty);
    });

    it("should trim whitespace from name", async () => {
      const newDuty = { id: 1, name: "Trimmed Duty" };
      mockRequest.body = { name: "  Trimmed Duty  " };

      (DutyModel.create as jest.Mock).mockResolvedValue(newDuty);

      await DutyController.create(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(DutyModel.create).toHaveBeenCalledWith({
        name: "Trimmed Duty",
      });
    });

    it("should return status 400 if name is missing", async () => {
      mockRequest.body = {};

      await DutyController.create(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(DutyModel.create).not.toHaveBeenCalled();
      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        error: "Name is required and must be a non-empty string",
      });
    });

    it("should return status 400 if name is not a string", async () => {
      mockRequest.body = { name: 123 };

      await DutyController.create(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(DutyModel.create).not.toHaveBeenCalled();
      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        error: "Name is required and must be a non-empty string",
      });
    });

    it("should return status 400 if name is empty string", async () => {
      mockRequest.body = { name: "" };

      await DutyController.create(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(DutyModel.create).not.toHaveBeenCalled();
      expect(mockStatus).toHaveBeenCalledWith(400);
    });

    it("should return status 400 if name is only whitespace", async () => {
      mockRequest.body = { name: "   " };

      await DutyController.create(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(DutyModel.create).not.toHaveBeenCalled();
      expect(mockStatus).toHaveBeenCalledWith(400);
    });

    it("should return status 400 if name exceeds 255 characters", async () => {
      const longName = "a".repeat(256);
      mockRequest.body = { name: longName };

      await DutyController.create(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(DutyModel.create).not.toHaveBeenCalled();
      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        error: "Name must be 255 characters or less",
      });
    });

    it("should handle errors and return status 500", async () => {
      mockRequest.body = { name: "Valid Duty" };
      const error = new Error("Database error");
      (DutyModel.create as jest.Mock).mockRejectedValue(error);

      const consoleSpy = jest.spyOn(console, "error").mockImplementation();

      await DutyController.create(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(consoleSpy).toHaveBeenCalledWith("Error creating duty:", error);
      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        error: "Internal server error",
      });

      consoleSpy.mockRestore();
    });
  });

  describe("update", () => {
    it("should update a duty with valid data and return status 200", async () => {
      const updatedDuty = { id: 1, name: "Updated Duty" };
      mockRequest.params = { id: "1" };
      mockRequest.body = { name: "Updated Duty" };

      (DutyModel.update as jest.Mock).mockResolvedValue(updatedDuty);

      await DutyController.update(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(DutyModel.update).toHaveBeenCalledWith("1", {
        name: "Updated Duty",
      });
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith(updatedDuty);
    });

    it("should trim whitespace from name", async () => {
      const updatedDuty = { id: 1, name: "Trimmed Duty" };
      mockRequest.params = { id: "1" };
      mockRequest.body = { name: "  Trimmed Duty  " };

      (DutyModel.update as jest.Mock).mockResolvedValue(updatedDuty);

      await DutyController.update(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(DutyModel.update).toHaveBeenCalledWith("1", {
        name: "Trimmed Duty",
      });
    });

    it("should return status 404 if duty not found", async () => {
      mockRequest.params = { id: "999" };
      mockRequest.body = { name: "Updated Duty" };

      (DutyModel.update as jest.Mock).mockResolvedValue(null);

      await DutyController.update(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(DutyModel.update).toHaveBeenCalled();
      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({
        error: "Duty not found",
      });
    });

    it("should return status 400 if name is missing", async () => {
      mockRequest.params = { id: "1" };
      mockRequest.body = {};

      await DutyController.update(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(DutyModel.update).not.toHaveBeenCalled();
      expect(mockStatus).toHaveBeenCalledWith(400);
    });

    it("should return status 400 if name exceeds 255 characters", async () => {
      const longName = "a".repeat(256);
      mockRequest.params = { id: "1" };
      mockRequest.body = { name: longName };

      await DutyController.update(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(DutyModel.update).not.toHaveBeenCalled();
      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        error: "Name must be 255 characters or less",
      });
    });

    it("should handle errors and return status 500", async () => {
      mockRequest.params = { id: "1" };
      mockRequest.body = { name: "Valid Duty" };
      const error = new Error("Database error");
      (DutyModel.update as jest.Mock).mockRejectedValue(error);

      const consoleSpy = jest.spyOn(console, "error").mockImplementation();

      await DutyController.update(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(consoleSpy).toHaveBeenCalledWith("Error updating duty:", error);
      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        error: "Internal server error",
      });

      consoleSpy.mockRestore();
    });
  });

  describe("delete", () => {
    it("should delete a duty and return status 204", async () => {
      mockRequest.params = { id: "1" };

      (DutyModel.delete as jest.Mock).mockResolvedValue(true);

      await DutyController.delete(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(DutyModel.delete).toHaveBeenCalledWith("1");
      expect(mockStatus).toHaveBeenCalledWith(204);
      expect(mockSend).toHaveBeenCalled();
    });

    it("should return status 404 if duty not found", async () => {
      mockRequest.params = { id: "999" };

      (DutyModel.delete as jest.Mock).mockResolvedValue(false);

      await DutyController.delete(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(DutyModel.delete).toHaveBeenCalledWith("999");
      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({
        error: "Duty not found",
      });
    });

    it("should handle errors and return status 500", async () => {
      mockRequest.params = { id: "1" };
      const error = new Error("Database error");
      (DutyModel.delete as jest.Mock).mockRejectedValue(error);

      const consoleSpy = jest.spyOn(console, "error").mockImplementation();

      await DutyController.delete(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(consoleSpy).toHaveBeenCalledWith("Error deleting duty:", error);
      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        error: "Internal server error",
      });

      consoleSpy.mockRestore();
    });
  });
});
