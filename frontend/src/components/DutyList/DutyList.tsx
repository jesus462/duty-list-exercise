import type { JSX } from "react";
import { List, Typography, Empty, Space } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import "./DutyList.css";
import type { DutyListProps } from "./types";
import { DutyEditInput } from "../DutyInput/update/DutyEditInput";
import { useDutyList } from "./useDutyList";

const { Text } = Typography;
const { Item } = List;

export const DutyList = ({
  duties,
  isLoading = false,
  isSubmitting = false,
  onUpdate,
  onDelete,
}: DutyListProps): JSX.Element => {
  const {
    isUpdating,
    hasItems,
    handleEdit,
    handleCancel,
    handleSave,
    isEditing,
  } = useDutyList({ duties, onUpdate });

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
      renderItem={(item) => {
        const itemIsEditing = isEditing(item.id);

        return (
          <Item className="duty-list-item">
            {itemIsEditing ? (
              <DutyEditInput
                initialValue={item.name}
                onSave={(value) => handleSave(item.id, value)}
                onCancel={handleCancel}
                isSubmitting={isUpdating || isSubmitting}
              />
            ) : (
              <>
                <Text>{item.name}</Text>
                <Space size="large">
                  <EditOutlined
                    className="action-icon"
                    onClick={() => handleEdit(item)}
                    disabled={isSubmitting}
                  />
                  <DeleteOutlined
                    className="action-icon"
                    onClick={() => onDelete?.(item)}
                    disabled={isSubmitting}
                  />
                </Space>
              </>
            )}
          </Item>
        );
      }}
    />
  );
};
