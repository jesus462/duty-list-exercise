import type { JSX } from "react";
import { List, Typography, Empty, Space } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import "./DutyList.css";

const { Text } = Typography;
const { Item } = List;

const placeholderItems = [
  { id: 1, name: "Sample duty 1" },
  { id: 2, name: "Sample duty 2" },
  { id: 3, name: "Sample duty 3" },
];

export const DutyList = (): JSX.Element => {
  const hasItems = placeholderItems.length > 0;

  if (!hasItems) {
    return <Empty description="No duties yet. Add your first duty above." />;
  }

  return (
    <List
      bordered
      dataSource={placeholderItems}
      renderItem={(item) => (
        <Item className="duty-list-item">
          <Text>{item.name}</Text>
          <Space size="large">
            <EditOutlined className="action-icon" />
            <DeleteOutlined className="action-icon" />
          </Space>
        </Item>
      )}
    />
  );
};
