import { useCallback, useEffect } from "react";
import { Form } from "antd";
import type { DutyFormValues, UseDutyEditInputParams } from "../types";
import { useDutyValidation } from "../useDutyValidation";

export const useDutyEditInput = ({
  initialValue,
  onSubmit,
  onCancel,
}: UseDutyEditInputParams) => {
  const [form] = Form.useForm<DutyFormValues>();
  const { validationRules } = useDutyValidation();

  useEffect(() => {
    form.setFieldsValue({ dutyName: initialValue });
  }, [form, initialValue]);

  const handleFinish = useCallback(
    async (values: DutyFormValues): Promise<void> => {
      const trimmedValue = values.dutyName.trim();
      if (!trimmedValue) {
        return;
      }

      await onSubmit(trimmedValue);
    },
    [onSubmit]
  );

  const handleCancel = useCallback((): void => {
    form.setFieldsValue({ dutyName: initialValue });
    form.resetFields(["dutyName"]);
    onCancel();
  }, [form, initialValue, onCancel]);

  return {
    form,
    rules: validationRules,
    handleFinish,
    handleCancel,
  };
};
