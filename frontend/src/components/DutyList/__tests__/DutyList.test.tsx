import { render, screen, fireEvent } from "@testing-library/react";
import { DutyList } from "../DutyList";
import { useDutyList } from "../useDutyList";
import type { DutyListProps } from "../types";
import type { Duty } from "../../../services/types";

jest.mock("../useDutyList", () => ({
  useDutyList: jest.fn(),
}));

jest.mock("../../DutyInput/update/DutyEditInput", () => ({
  DutyEditInput: ({
    initialValue,
    onSave,
    onCancel,
  }: {
    initialValue: string;
    onSave: (value: string) => void;
    onCancel: () => void;
  }) => (
    <div data-testid="duty-edit-input">
      <input
        data-testid="edit-input"
        defaultValue={initialValue}
        data-initial-value={initialValue}
      />
      <button data-testid="save-button" onClick={() => onSave(initialValue)}>
        Save
      </button>
      <button data-testid="cancel-button" onClick={onCancel}>
        Cancel
      </button>
    </div>
  ),
}));

describe("DutyList", () => {
  const mockDuties: Duty[] = [
    { id: 1, name: "Duty 1" },
    { id: 2, name: "Duty 2" },
  ];

  const mockOnUpdate = jest.fn();
  const mockOnDelete = jest.fn();

  const defaultProps: DutyListProps = {
    duties: mockDuties,
    onUpdate: mockOnUpdate,
    onDelete: mockOnDelete,
  };

  const mockUseDutyListReturn = {
    isUpdating: false,
    hasItems: true,
    handleEdit: jest.fn(),
    handleCancel: jest.fn(),
    handleSave: jest.fn(),
    isEditing: jest.fn((_id: number) => false),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useDutyList as jest.Mock).mockReturnValue(mockUseDutyListReturn);
  });

  describe("empty state", () => {
    it("should render empty state when no duties", () => {
      (useDutyList as jest.Mock).mockReturnValue({
        ...mockUseDutyListReturn,
        hasItems: false,
      });

      render(<DutyList duties={[]} />);

      expect(
        screen.getByText("No duties yet. Add your first duty.")
      ).toBeInTheDocument();
    });

    it("should render loading empty state", () => {
      (useDutyList as jest.Mock).mockReturnValue({
        ...mockUseDutyListReturn,
        hasItems: false,
      });

      render(<DutyList duties={[]} isLoading={true} />);

      expect(screen.getByText("Loading duties...")).toBeInTheDocument();
    });
  });

  describe("list rendering", () => {
    it("should render list of duties", () => {
      render(<DutyList {...defaultProps} />);

      expect(screen.getByText("Duty 1")).toBeInTheDocument();
      expect(screen.getByText("Duty 2")).toBeInTheDocument();
    });

    it("should render edit and delete icons for each duty", () => {
      render(<DutyList {...defaultProps} />);

      const editIcons = document.querySelectorAll(".anticon-edit");
      const deleteIcons = document.querySelectorAll(".anticon-delete");

      expect(editIcons.length).toBe(2);
      expect(deleteIcons.length).toBe(2);
    });

    it("should call handleEdit when edit icon is clicked", () => {
      const mockHandleEdit = jest.fn();
      (useDutyList as jest.Mock).mockReturnValue({
        ...mockUseDutyListReturn,
        handleEdit: mockHandleEdit,
      });

      render(<DutyList {...defaultProps} />);

      const editIcons = document.querySelectorAll(".anticon-edit");
      if (editIcons.length > 0) {
        fireEvent.click(editIcons[0] as Element);
        expect(mockHandleEdit).toHaveBeenCalledWith(mockDuties[0]);
      }
    });

    it("should call onDelete when delete icon is clicked", () => {
      render(<DutyList {...defaultProps} />);

      const deleteIcons = document.querySelectorAll(".anticon-delete");
      if (deleteIcons.length > 0) {
        fireEvent.click(deleteIcons[0] as Element);
        expect(mockOnDelete).toHaveBeenCalledWith(mockDuties[0]);
      }
    });

    it("should not call onDelete if it is not provided", () => {
      const { onDelete, ...propsWithoutDelete } = defaultProps;
      render(<DutyList {...propsWithoutDelete} />);

      const deleteIcons = document.querySelectorAll(".anticon-delete");
      if (deleteIcons.length > 0) {
        fireEvent.click(deleteIcons[0] as Element);
        expect(deleteIcons[0]).toBeInTheDocument();
      }
    });
  });

  describe("edit mode", () => {
    it("should render DutyEditInput when item is being edited", () => {
      (useDutyList as jest.Mock).mockReturnValue({
        ...mockUseDutyListReturn,
        isEditing: jest.fn((id: number) => id === 1),
      });

      render(<DutyList {...defaultProps} />);

      expect(screen.getByTestId("duty-edit-input")).toBeInTheDocument();
      const editInput = screen.getByTestId("edit-input");
      expect(editInput).toHaveAttribute("data-initial-value", "Duty 1");
    });

    it("should not render edit input for non-editing items", () => {
      (useDutyList as jest.Mock).mockReturnValue({
        ...mockUseDutyListReturn,
        isEditing: jest.fn((id: number) => id === 1),
      });

      render(<DutyList {...defaultProps} />);

      expect(screen.getByTestId("duty-edit-input")).toBeInTheDocument();
      expect(screen.getByText("Duty 2")).toBeInTheDocument();
    });

    it("should call handleSave when save button is clicked in edit mode", () => {
      const mockHandleSave = jest.fn();
      (useDutyList as jest.Mock).mockReturnValue({
        ...mockUseDutyListReturn,
        isEditing: jest.fn((id: number) => id === 1),
        handleSave: mockHandleSave,
      });

      render(<DutyList {...defaultProps} />);

      const saveButton = screen.getByTestId("save-button");
      fireEvent.click(saveButton);

      expect(mockHandleSave).toHaveBeenCalledWith(1, "Duty 1");
    });

    it("should call handleCancel when cancel button is clicked in edit mode", () => {
      const mockHandleCancel = jest.fn();
      (useDutyList as jest.Mock).mockReturnValue({
        ...mockUseDutyListReturn,
        isEditing: jest.fn((id: number) => id === 1),
        handleCancel: mockHandleCancel,
      });

      render(<DutyList {...defaultProps} />);

      const cancelButton = screen.getByTestId("cancel-button");
      fireEvent.click(cancelButton);

      expect(mockHandleCancel).toHaveBeenCalled();
    });
  });

  describe("loading and submitting states", () => {
    it("should show loading state on list", () => {
      render(<DutyList {...defaultProps} isLoading={true} />);

      const list = document.querySelector(".ant-list");
      expect(list).toBeInTheDocument();
    });

    it("should disable icons when isSubmitting is true", () => {
      render(<DutyList {...defaultProps} isSubmitting={true} />);

      const editIcons = document.querySelectorAll(".anticon-edit");
      const deleteIcons = document.querySelectorAll(".anticon-delete");

      expect(editIcons.length).toBeGreaterThan(0);
      expect(deleteIcons.length).toBeGreaterThan(0);
    });

    it("should disable edit input when isUpdating is true", () => {
      (useDutyList as jest.Mock).mockReturnValue({
        ...mockUseDutyListReturn,
        isUpdating: true,
        isEditing: jest.fn((id: number) => id === 1),
      });

      render(<DutyList {...defaultProps} />);

      expect(screen.getByTestId("duty-edit-input")).toBeInTheDocument();
    });

    it("should disable edit input when isSubmitting is true", () => {
      (useDutyList as jest.Mock).mockReturnValue({
        ...mockUseDutyListReturn,
        isEditing: jest.fn((id: number) => id === 1),
      });

      render(<DutyList {...defaultProps} isSubmitting={true} />);

      expect(screen.getByTestId("duty-edit-input")).toBeInTheDocument();
    });
  });
});
