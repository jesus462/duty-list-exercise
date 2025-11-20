import { useCallback, useMemo } from "react";
import { Form } from "antd";
import { DUTY_NAME_MAX_LENGTH } from "../../utils/constants";
import type { DutyFormValues, UseDutyInputParams } from "./types";

export const useDutyInput = ({ onSubmit }: UseDutyInputParams) => {
  const [form] = Form.useForm<DutyFormValues>();

  const rules = useMemo(
    () => [
      {
        required: true,
        message: "Please enter a duty name.",
      },
      {
        validator: (_: unknown, value?: string) => {
          const trimmedValue = value?.trim() || "";
          if (!trimmedValue) {
            return Promise.reject(
              new Error("Duty name cannot be only spaces.")
            );
          }
          if (trimmedValue.length > DUTY_NAME_MAX_LENGTH) {
            return Promise.reject(
              new Error(
                `Duty name must be ${DUTY_NAME_MAX_LENGTH} characters or fewer.`
              )
            );
          }
          return Promise.resolve();
        },
      },
    ],
    []
  );

  const handleFinish = useCallback(
    async (values: DutyFormValues): Promise<void> => {
      const trimmedValue = values.dutyName.trim();
      if (!trimmedValue) {
        return;
      }

      await onSubmit(trimmedValue);
      form.resetFields();
    },
    [form, onSubmit]
  );

  const handleBlur = useCallback((): void => {
    const value = form.getFieldValue("dutyName");
    if (!value || value.trim().length === 0) {
      form.resetFields(["dutyName"]);
    }
  }, [form]);

  return {
    form,
    rules,
    handleFinish,
    handleBlur,
  };
};
