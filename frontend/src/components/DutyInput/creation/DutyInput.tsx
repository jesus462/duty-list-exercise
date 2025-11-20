import type { JSX } from "react";
import { Input, Button, Form } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { DUTY_NAME_MAX_LENGTH } from "../../../utils/constants";
import { useDutyInput } from "./useDutyInput.ts";
import type { DutyInputProps } from "../types";
import "./DutyInput.css";

const { Item } = Form;

export const DutyInput = ({
  placeholder = "Enter a new duty",
  isSubmitting = false,
  onSubmit,
}: DutyInputProps): JSX.Element => {
  const { form, rules, handleFinish, handleBlur } = useDutyInput({ onSubmit });

  return (
    <Form form={form} layout="vertical" onFinish={handleFinish}>
      <Item name="dutyName" rules={rules} className="duty-input-item">
        <Input
          placeholder={placeholder}
          size="large"
          allowClear
          disabled={isSubmitting}
          maxLength={DUTY_NAME_MAX_LENGTH}
          onBlur={handleBlur}
          suffix={
            <Button
              type="primary"
              icon={<PlusOutlined />}
              size="middle"
              loading={isSubmitting}
              htmlType="submit"
            >
              Add
            </Button>
          }
        />
      </Item>
    </Form>
  );
};
