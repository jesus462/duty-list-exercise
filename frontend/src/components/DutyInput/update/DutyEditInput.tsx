import type { JSX } from "react";
import { Input, Button, Form, Space } from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { useDutyEditInput } from "./useDutyEditInput";
import type { DutyEditInputProps } from "../types";
import { DUTY_NAME_MAX_LENGTH } from "../../../utils/constants";
import "./DutyEditInput.css";

const { Item } = Form;

export const DutyEditInput = ({
  initialValue,
  onSave,
  onCancel,
  isSubmitting = false,
}: DutyEditInputProps): JSX.Element => {
  const { form, rules, handleFinish, handleCancel } = useDutyEditInput({
    initialValue,
    onSubmit: onSave,
    onCancel,
  });

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Escape") {
      handleCancel();
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleFinish}
      className="duty-edit-form"
    >
      <Item name="dutyName" rules={rules} className="duty-edit-item">
        <Input
          onKeyDown={handleKeyDown}
          disabled={isSubmitting}
          maxLength={DUTY_NAME_MAX_LENGTH}
          suffix={
            <Space size="small">
              <Button
                type="text"
                icon={<CheckOutlined />}
                htmlType="submit"
                disabled={isSubmitting}
                className="edit-action-button"
                title="Save"
              />
              <Button
                type="text"
                icon={<CloseOutlined />}
                onClick={handleCancel}
                disabled={isSubmitting}
                className="edit-action-button"
                title="Cancel"
              />
            </Space>
          }
          autoFocus
        />
      </Item>
    </Form>
  );
};
