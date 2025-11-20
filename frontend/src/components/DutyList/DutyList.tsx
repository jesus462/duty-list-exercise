import type { JSX } from "react";
import { List, Typography, Empty, Space } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import "./DutyList.css";
import type { DutyListProps } from "./types";

const { Text } = Typography;
const { Item } = List;

export const DutyList = ({
  duties,
  isLoading = false,
  onEdit,
  onDelete,
}: DutyListProps): JSX.Element => {
  const hasItems = duties.length > 0;

  if (!hasItems) {
    return (
      <Empty
        description={
          isLoading
            ? "Loading duties..."
            : "No duties yet. Add your first duty."
        }
      />
    );
  }

  return (
    <List
      bordered
      loading={isLoading}
      dataSource={duties}
      renderItem={(item) => (
        <Item className="duty-list-item">
          <Text>{item.name}</Text>
          <Space size="large">
            <EditOutlined
              className="action-icon"
              onClick={() => onEdit?.(item)}
            />
            <DeleteOutlined
              className="action-icon"
              onClick={() => onDelete?.(item)}
            />
          </Space>
        </Item>
      )}
    />
  );
};
