import { renderHook, act, waitFor } from "@testing-library/react";
import { useDutyList } from "../useDutyList";
import type { Duty } from "../../../services/types";

describe("useDutyList", () => {
  const mockDuties: Duty[] = [
    { id: 1, name: "Duty 1" },
    { id: 2, name: "Duty 2" },
  ];

  const mockOnUpdate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("initial state", () => {
    it("should initialize with no editing state", () => {
      const { result } = renderHook(() =>
        useDutyList({ duties: mockDuties, onUpdate: mockOnUpdate })
      );

      expect(result.current.editingId).toBeNull();
      expect(result.current.isUpdating).toBe(false);
      expect(result.current.hasItems).toBe(true);
    });

    it("should return hasItems as false when duties array is empty", () => {
      const { result } = renderHook(() =>
        useDutyList({ duties: [], onUpdate: mockOnUpdate })
      );

      expect(result.current.hasItems).toBe(false);
    });
  });

  describe("handleEdit", () => {
    it("should set editingId when handleEdit is called", () => {
      const { result } = renderHook(() =>
        useDutyList({ duties: mockDuties, onUpdate: mockOnUpdate })
      );

      act(() => {
        result.current.handleEdit(mockDuties[0]);
      });

      expect(result.current.editingId).toBe(1);
    });

    it("should update editingId when editing a different duty", () => {
      const { result } = renderHook(() =>
        useDutyList({ duties: mockDuties, onUpdate: mockOnUpdate })
      );

      act(() => {
        result.current.handleEdit(mockDuties[0]);
      });
      expect(result.current.editingId).toBe(1);

      act(() => {
        result.current.handleEdit(mockDuties[1]);
      });
      expect(result.current.editingId).toBe(2);
    });
  });

  describe("handleCancel", () => {
    it("should clear editingId when handleCancel is called", () => {
      const { result } = renderHook(() =>
        useDutyList({ duties: mockDuties, onUpdate: mockOnUpdate })
      );

      act(() => {
        result.current.handleEdit(mockDuties[0]);
      });
      expect(result.current.editingId).toBe(1);

      act(() => {
        result.current.handleCancel();
      });
      expect(result.current.editingId).toBeNull();
    });

    it("should work even when no duty is being edited", () => {
      const { result } = renderHook(() =>
        useDutyList({ duties: mockDuties, onUpdate: mockOnUpdate })
      );

      act(() => {
        result.current.handleCancel();
      });

      expect(result.current.editingId).toBeNull();
    });
  });

  describe("handleSave", () => {
    it("should call onUpdate and clear editingId on successful save", async () => {
      mockOnUpdate.mockResolvedValue(undefined);
      const { result } = renderHook(() =>
        useDutyList({ duties: mockDuties, onUpdate: mockOnUpdate })
      );

      act(() => {
        result.current.handleEdit(mockDuties[0]);
      });

      await act(async () => {
        await result.current.handleSave(1, "Updated Duty");
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      await waitFor(() => {
        expect(mockOnUpdate).toHaveBeenCalledWith(1, "Updated Duty");
        expect(result.current.editingId).toBeNull();
        expect(result.current.isUpdating).toBe(false);
      });
    });

    it("should set isUpdating during save operation", async () => {
      let resolveUpdate: () => void;
      const updatePromise = new Promise<void>((resolve) => {
        resolveUpdate = resolve;
      });
      mockOnUpdate.mockReturnValue(updatePromise);

      const { result } = renderHook(() =>
        useDutyList({ duties: mockDuties, onUpdate: mockOnUpdate })
      );

      act(() => {
        result.current.handleEdit(mockDuties[0]);
      });

      let savePromise: Promise<void>;
      await act(async () => {
        savePromise = result.current.handleSave(1, "Updated Duty");
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      expect(result.current.isUpdating).toBe(true);

      await act(async () => {
        resolveUpdate!();
        await savePromise!;
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      await waitFor(() => {
        expect(result.current.isUpdating).toBe(false);
      });
    });

    it("should handle save errors gracefully", async () => {
      const error = new Error("Update failed");
      mockOnUpdate.mockRejectedValue(error);
      const consoleSpy = jest.spyOn(console, "error").mockImplementation();

      const { result } = renderHook(() =>
        useDutyList({ duties: mockDuties, onUpdate: mockOnUpdate })
      );

      act(() => {
        result.current.handleEdit(mockDuties[0]);
      });

      await act(async () => {
        await result.current.handleSave(1, "Updated Duty");
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      await waitFor(() => {
        expect(result.current.isUpdating).toBe(false);
      });

      expect(consoleSpy).toHaveBeenCalledWith("Failed to update duty:", error);
      expect(result.current.editingId).toBe(1);

      consoleSpy.mockRestore();
    });

    it("should work without onUpdate callback", async () => {
      const { result } = renderHook(() => useDutyList({ duties: mockDuties }));

      act(() => {
        result.current.handleEdit(mockDuties[0]);
      });

      await act(async () => {
        await result.current.handleSave(1, "Updated Duty");
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      await waitFor(() => {
        expect(result.current.editingId).toBeNull();
        expect(result.current.isUpdating).toBe(false);
      });
    });
  });

  describe("isEditing", () => {
    it("should return false when no duty is being edited", () => {
      const { result } = renderHook(() =>
        useDutyList({ duties: mockDuties, onUpdate: mockOnUpdate })
      );

      expect(result.current.isEditing(1)).toBe(false);
      expect(result.current.isEditing(2)).toBe(false);
    });

    it("should return true for the duty being edited", () => {
      const { result } = renderHook(() =>
        useDutyList({ duties: mockDuties, onUpdate: mockOnUpdate })
      );

      act(() => {
        result.current.handleEdit(mockDuties[0]);
      });

      expect(result.current.isEditing(1)).toBe(true);
      expect(result.current.isEditing(2)).toBe(false);
    });

    it("should return false after canceling edit", () => {
      const { result } = renderHook(() =>
        useDutyList({ duties: mockDuties, onUpdate: mockOnUpdate })
      );

      act(() => {
        result.current.handleEdit(mockDuties[0]);
      });
      expect(result.current.isEditing(1)).toBe(true);

      act(() => {
        result.current.handleCancel();
      });
      expect(result.current.isEditing(1)).toBe(false);
    });
  });
});
