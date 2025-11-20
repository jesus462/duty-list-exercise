import { useCallback, useEffect, useState } from "react";
import { message } from "antd";
import { fetchDuties, createDuty, updateDuty } from "../services/dutyService";
import type { Duty } from "../services/types";

export const useAppHook = () => {
  const [duties, setDuties] = useState<Duty[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    const loadDuties = async (): Promise<void> => {
      setIsLoading(true);
      try {
        const data = await fetchDuties();
        setDuties(data);
      } catch (error) {
        const err = error as Error;
        console.error(err.message);
        messageApi.error("Failed to load duties.");
      } finally {
        setIsLoading(false);
      }
    };

    void loadDuties();
  }, [messageApi]);

  const handleCreateDuty = useCallback(
    async (name: string): Promise<void> => {
      setIsSubmitting(true);
      try {
        const createdDuty = await createDuty({ name });
        setDuties((prev) => [createdDuty, ...prev]);
        messageApi.success("Duty added successfully.");
      } catch (error) {
        const err = error as Error;
        console.error(err.message);
        messageApi.error("Failed to add duty.");
      } finally {
        setIsSubmitting(false);
      }
    },
    [messageApi]
  );

  const handleUpdateDuty = useCallback(
    async (id: number, name: string): Promise<void> => {
      setIsSubmitting(true);
      try {
        const updatedDuty = await updateDuty(id, { name });
        setDuties((prev) =>
          prev.map((duty) => (duty.id === id ? updatedDuty : duty))
        );
        messageApi.success("Duty updated successfully.");
      } catch (error) {
        const err = error as Error;
        console.error(err.message);
        messageApi.error("Failed to update duty.");
      } finally {
        setIsSubmitting(false);
      }
    },
    [messageApi]
  );

  return {
    duties,
    isLoading,
    isSubmitting,
    handleCreateDuty,
    handleUpdateDuty,
    contextHolder,
  };
};
