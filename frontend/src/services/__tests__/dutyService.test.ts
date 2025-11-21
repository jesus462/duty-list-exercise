import {
  fetchDuties,
  createDuty,
  updateDuty,
  deleteDuty,
} from "../dutyService";

jest.mock("../../utils/constants", () => ({
  API_BASE_URL: "http://localhost:3000/api",
}));

const mockFetch = jest.fn();
globalThis.fetch = mockFetch as unknown as typeof fetch;

describe("dutyService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("fetchDuties", () => {
    it("should fetch all duties successfully", async () => {
      const mockDuties = [
        { id: 1, name: "Duty 1" },
        { id: 2, name: "Duty 2" },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockDuties,
      });

      const result = await fetchDuties();

      expect(mockFetch).toHaveBeenCalledWith(
        "http://localhost:3000/api/duties"
      );
      expect(result).toEqual(mockDuties);
    });

    it("should throw error when fetch fails", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: "Failed to fetch duties" }),
      });

      await expect(fetchDuties()).rejects.toThrow("Failed to fetch duties");
    });

    it("should throw generic error when response has no error message", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({}),
      });

      await expect(fetchDuties()).rejects.toThrow(
        "Something went wrong. Please try again."
      );
    });

    it("should handle JSON parse errors", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => {
          throw new Error("Invalid JSON");
        },
      });

      await expect(fetchDuties()).rejects.toThrow(
        "Something went wrong. Please try again."
      );
    });
  });

  describe("createDuty", () => {
    it("should create a duty successfully", async () => {
      const newDuty = { id: 1, name: "New Duty" };
      const payload = { name: "New Duty" };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => newDuty,
      });

      const result = await createDuty(payload);

      expect(mockFetch).toHaveBeenCalledWith(
        "http://localhost:3000/api/duties",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );
      expect(result).toEqual(newDuty);
    });

    it("should throw error when creation fails", async () => {
      const payload = { name: "New Duty" };

      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: "Name is required" }),
      });

      await expect(createDuty(payload)).rejects.toThrow("Name is required");
    });
  });

  describe("updateDuty", () => {
    it("should update a duty successfully", async () => {
      const updatedDuty = { id: 1, name: "Updated Duty" };
      const payload = { name: "Updated Duty" };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => updatedDuty,
      });

      const result = await updateDuty(1, payload);

      expect(mockFetch).toHaveBeenCalledWith(
        "http://localhost:3000/api/duties/1",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );
      expect(result).toEqual(updatedDuty);
    });

    it("should throw error when update fails", async () => {
      const payload = { name: "Updated Duty" };

      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: "Duty not found" }),
      });

      await expect(updateDuty(999, payload)).rejects.toThrow("Duty not found");
    });
  });

  describe("deleteDuty", () => {
    it("should delete a duty successfully", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 204,
      });

      await deleteDuty(1);

      expect(mockFetch).toHaveBeenCalledWith(
        "http://localhost:3000/api/duties/1",
        {
          method: "DELETE",
        }
      );
    });

    it("should throw error when deletion fails", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: "Duty not found" }),
      });

      await expect(deleteDuty(999)).rejects.toThrow("Duty not found");
    });

    it("should throw error when status is not 204", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
      });

      await expect(deleteDuty(1)).rejects.toThrow(
        "Unexpected response from server"
      );
    });
  });
});
