import { useState, useCallback } from "react";
import type { Duty } from "../../services/types";
import type { UseDutyListParams } from "./types";

export const useDutyList = ({ duties, onUpdate }: UseDutyListParams) => {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  const hasItems = duties.length > 0;

  const handleEdit = useCallback((duty: Duty): void => {
    setEditingId(duty.id);
  }, []);

  const handleCancel = useCallback((): void => {
    setEditingId(null);
  }, []);

  const handleSave = useCallback(
    async (id: number, value: string): Promise<void> => {
      setIsUpdating(true);
      try {
        await onUpdate?.(id, value);
        setEditingId(null);
      } catch (error) {
        console.error("Failed to update duty:", error);
      } finally {
        setIsUpdating(false);
      }
    },
    [onUpdate]
  );

  const isEditing = useCallback(
    (id: number): boolean => {
      return editingId === id;
    },
    [editingId]
  );

  return {
    editingId,
    isUpdating,
    hasItems,
    handleEdit,
    handleCancel,
    handleSave,
    isEditing,
  };
};
