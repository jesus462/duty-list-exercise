import { useCallback } from "react";
import { Form } from "antd";
import type { DutyFormValues, UseDutyInputParams } from "../types";
import { useDutyValidation } from "../useDutyValidation";

export const useDutyInput = ({ onSubmit }: UseDutyInputParams) => {
  const [form] = Form.useForm<DutyFormValues>();
  const { validationRules } = useDutyValidation();

  const rules = validationRules;

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
