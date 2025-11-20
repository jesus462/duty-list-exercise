import type { JSX } from "react";
import { Input, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import "./DutyInput.css";

export const DutyInput = (): JSX.Element => {
  return (
    <div className="duty-input">
      <Input
        placeholder="Enter a new duty"
        size="large"
        allowClear
        suffix={
          <Button type="primary" icon={<PlusOutlined />} size="middle">
            Add
          </Button>
        }
      />
    </div>
  );
};
