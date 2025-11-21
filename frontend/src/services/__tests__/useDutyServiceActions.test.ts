import { renderHook, waitFor, act } from "@testing-library/react";
import * as React from "react";
import { message } from "antd";
import { useDutyServiceActions } from "../useDutyServiceActions";
import {
  fetchDuties,
  createDuty,
  updateDuty,
  deleteDuty,
} from "../dutyService";
import type { Duty } from "../types";

jest.mock("../../utils/constants", () => ({
  API_BASE_URL: "http://localhost:3000/api",
}));

jest.mock("../dutyService");

jest.mock("antd", () => {
  const actual = jest.requireActual("antd");
  return {
    ...actual,
    message: {
      useMessage: jest.fn(() => [
        {
          success: jest.fn(),
          error: jest.fn(),
        },
        React.createElement("div", { key: "context" }),
      ]),
    },
  };
});

describe("useDutyServiceActions", () => {
  const mockSuccess = jest.fn();
  const mockError = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (message.useMessage as jest.Mock).mockReturnValue([
      {
        success: mockSuccess,
        error: mockError,
      },
      React.createElement("div", { key: "context" }),
    ]);
  });

  describe("initial load", () => {
    it("should fetch duties on mount", async () => {
      const mockDuties: Duty[] = [
        { id: 1, name: "Duty 1" },
        { id: 2, name: "Duty 2" },
      ];

      (fetchDuties as jest.Mock).mockResolvedValue(mockDuties);

      const { result } = renderHook(() => useDutyServiceActions());

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(fetchDuties).toHaveBeenCalledTimes(1);
      expect(result.current.duties).toEqual(mockDuties);
    });

    it("should handle fetch error", async () => {
      const error = new Error("Failed to fetch");
      (fetchDuties as jest.Mock).mockRejectedValue(error);
      const consoleSpy = jest.spyOn(console, "error").mockImplementation();

      renderHook(() => useDutyServiceActions());

      await waitFor(() => {
        expect(mockError).toHaveBeenCalledWith("Failed to load duties.");
      });

      expect(consoleSpy).toHaveBeenCalledWith("Failed to fetch");

      consoleSpy.mockRestore();
    });
  });

  describe("handleCreateDuty", () => {
    it("should create a duty and add it to the list", async () => {
      const existingDuties: Duty[] = [{ id: 1, name: "Duty 1" }];
      const newDuty: Duty = { id: 2, name: "New Duty" };

      (fetchDuties as jest.Mock).mockResolvedValue(existingDuties);
      (createDuty as jest.Mock).mockResolvedValue(newDuty);

      const { result } = renderHook(() => useDutyServiceActions());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.handleCreateDuty("New Duty");
      });

      await waitFor(() => {
        expect(createDuty).toHaveBeenCalledWith({ name: "New Duty" });
        expect(result.current.duties).toContainEqual(newDuty);
        expect(result.current.duties[0]).toEqual(newDuty); // New duty should be first
        expect(result.current.isSubmitting).toBe(false);
        expect(mockSuccess).toHaveBeenCalledWith("Duty added successfully.");
      });
    });

    it("should handle create error", async () => {
      const existingDuties: Duty[] = [{ id: 1, name: "Duty 1" }];
      const error = new Error("Failed to create");

      (fetchDuties as jest.Mock).mockResolvedValue(existingDuties);
      (createDuty as jest.Mock).mockRejectedValue(error);
      const consoleSpy = jest.spyOn(console, "error").mockImplementation();

      const { result } = renderHook(() => useDutyServiceActions());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.handleCreateDuty("New Duty");
      });

      await waitFor(() => {
        expect(result.current.duties).toEqual(existingDuties);
        expect(result.current.isSubmitting).toBe(false);
        expect(mockError).toHaveBeenCalledWith("Failed to add duty.");
      });

      expect(consoleSpy).toHaveBeenCalledWith("Failed to create");
      consoleSpy.mockRestore();
    });
  });

  describe("handleUpdateDuty", () => {
    it("should update a duty in the list", async () => {
      const duties: Duty[] = [
        { id: 1, name: "Duty 1" },
        { id: 2, name: "Duty 2" },
      ];
      const updatedDuty: Duty = { id: 1, name: "Updated Duty 1" };

      (fetchDuties as jest.Mock).mockResolvedValue(duties);
      (updateDuty as jest.Mock).mockResolvedValue(updatedDuty);

      const { result } = renderHook(() => useDutyServiceActions());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.handleUpdateDuty(1, "Updated Duty 1");
      });

      await waitFor(() => {
        expect(updateDuty).toHaveBeenCalledWith(1, { name: "Updated Duty 1" });
        expect(result.current.duties[0]).toEqual(updatedDuty);
        expect(result.current.duties[1]).toEqual(duties[1]);
        expect(result.current.isSubmitting).toBe(false);
        expect(mockSuccess).toHaveBeenCalledWith("Duty updated successfully.");
      });
    });

    it("should handle update error", async () => {
      const duties: Duty[] = [{ id: 1, name: "Duty 1" }];
      const error = new Error("Failed to update");

      (fetchDuties as jest.Mock).mockResolvedValue(duties);
      (updateDuty as jest.Mock).mockRejectedValue(error);
      const consoleSpy = jest.spyOn(console, "error").mockImplementation();

      const { result } = renderHook(() => useDutyServiceActions());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.handleUpdateDuty(1, "Updated Duty");
      });

      await waitFor(() => {
        expect(result.current.duties).toEqual(duties);
        expect(result.current.isSubmitting).toBe(false);
        expect(mockError).toHaveBeenCalledWith("Failed to update duty.");
      });

      expect(consoleSpy).toHaveBeenCalledWith("Failed to update");
      consoleSpy.mockRestore();
    });
  });

  describe("handleDeleteDuty", () => {
    it("should delete a duty from the list", async () => {
      const duties: Duty[] = [
        { id: 1, name: "Duty 1" },
        { id: 2, name: "Duty 2" },
      ];

      (fetchDuties as jest.Mock).mockResolvedValue(duties);
      (deleteDuty as jest.Mock).mockResolvedValue(undefined);

      const { result } = renderHook(() => useDutyServiceActions());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.handleDeleteDuty(duties[0]);
      });

      await waitFor(() => {
        expect(deleteDuty).toHaveBeenCalledWith(1);
        expect(result.current.duties).not.toContainEqual(duties[0]);
        expect(result.current.duties).toContainEqual(duties[1]);
        expect(result.current.isSubmitting).toBe(false);
        expect(mockSuccess).toHaveBeenCalledWith("Duty deleted successfully.");
      });
    });

    it("should handle delete error", async () => {
      const duties: Duty[] = [{ id: 1, name: "Duty 1" }];
      const error = new Error("Failed to delete");

      (fetchDuties as jest.Mock).mockResolvedValue(duties);
      (deleteDuty as jest.Mock).mockRejectedValue(error);
      const consoleSpy = jest.spyOn(console, "error").mockImplementation();

      const { result } = renderHook(() => useDutyServiceActions());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.handleDeleteDuty(duties[0]);
      });

      await waitFor(() => {
        expect(result.current.duties).toEqual(duties);
        expect(result.current.isSubmitting).toBe(false);
        expect(mockError).toHaveBeenCalledWith("Failed to delete duty.");
      });

      expect(consoleSpy).toHaveBeenCalledWith("Failed to delete");
      consoleSpy.mockRestore();
    });
  });
});
