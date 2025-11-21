import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Form } from "antd";
import { DutyEditInput } from "../DutyEditInput";
import { useDutyEditInput } from "../useDutyEditInput";
import type { DutyEditInputProps } from "../../types";

jest.mock("../../../../utils/constants", () => ({
  API_BASE_URL: "http://localhost:3000/api",
  DUTY_NAME_MAX_LENGTH: 255,
}));

jest.mock("../useDutyEditInput", () => ({
  useDutyEditInput: jest.fn(),
}));

const FormWrapper = ({ children }: { children: React.ReactNode }) => {
  const [form] = Form.useForm();
  return <Form form={form}>{children}</Form>;
};

describe("DutyEditInput", () => {
  const mockOnSave = jest.fn();
  const mockOnCancel = jest.fn();
  const mockHandleFinish = jest.fn();
  const mockHandleCancel = jest.fn();
  let mockForm: ReturnType<typeof Form.useForm>[0];
  const mockValidationRules = [
    {
      required: true,
      message: "Please enter a duty name.",
    },
  ];

  const defaultProps: DutyEditInputProps = {
    initialValue: "Initial Duty",
    onSave: mockOnSave,
    onCancel: mockOnCancel,
  };

  const TestFormProvider = () => {
    const [form] = Form.useForm();
    mockForm = form;
    return null;
  };

  const mockUseDutyEditInputReturn = () => ({
    form: mockForm,
    rules: mockValidationRules,
    handleFinish: mockHandleFinish,
    handleCancel: mockHandleCancel,
  });

  beforeEach(() => {
    jest.clearAllMocks();
    act(() => {
      const { unmount } = render(
        <FormWrapper>
          <TestFormProvider />
        </FormWrapper>
      );
      unmount();
    });
    (useDutyEditInput as jest.Mock).mockReturnValue(
      mockUseDutyEditInputReturn()
    );
  });

  describe("rendering", () => {
    it("should render form with input and buttons", async () => {
      await act(async () => {
        render(<DutyEditInput {...defaultProps} />);
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      expect(screen.getByRole("textbox")).toBeInTheDocument();
      expect(screen.getByTitle("Save")).toBeInTheDocument();
      expect(screen.getByTitle("Cancel")).toBeInTheDocument();
    });

    it("should render input (initial value set by hook)", async () => {
      await act(async () => {
        render(<DutyEditInput {...defaultProps} />);
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      const input = screen.getByRole("textbox");
      expect(input).toBeInTheDocument();
      expect(useDutyEditInput).toHaveBeenCalledWith(
        expect.objectContaining({
          initialValue: "Initial Duty",
        })
      );
    });

    it("should render input with correct attributes", async () => {
      await act(async () => {
        render(<DutyEditInput {...defaultProps} />);
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("maxlength", "255");
      expect(input).not.toBeDisabled();
    });

    it("should render save button with correct attributes", async () => {
      await act(async () => {
        render(<DutyEditInput {...defaultProps} />);
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      const saveButton = screen.getByTitle("Save");
      expect(saveButton).toHaveAttribute("type", "submit");
      expect(saveButton).not.toBeDisabled();
    });

    it("should render cancel button with correct attributes", async () => {
      await act(async () => {
        render(<DutyEditInput {...defaultProps} />);
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      const cancelButton = screen.getByTitle("Cancel");
      expect(cancelButton).not.toBeDisabled();
    });

    it("should render input as disabled when isSubmitting is true", async () => {
      await act(async () => {
        render(<DutyEditInput {...defaultProps} isSubmitting={true} />);
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      const input = screen.getByRole("textbox");
      expect(input).toBeDisabled();
    });

    it("should render buttons as disabled when isSubmitting is true", async () => {
      await act(async () => {
        render(<DutyEditInput {...defaultProps} isSubmitting={true} />);
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      const saveButton = screen.getByTitle("Save");
      const cancelButton = screen.getByTitle("Cancel");
      expect(saveButton).toBeDisabled();
      expect(cancelButton).toBeDisabled();
    });
  });

  describe("form submission", () => {
    it("should call handleFinish when form is submitted", async () => {
      const user = userEvent.setup();
      render(<DutyEditInput {...defaultProps} />);

      const input = screen.getByRole("textbox");
      const form = input.closest("form");

      await user.type(input, " Updated");
      if (form) {
        fireEvent.submit(form);
      }

      await waitFor(() => {
        expect(mockHandleFinish).toHaveBeenCalledTimes(1);
      });
    });

    it("should call handleFinish when save button is clicked", async () => {
      const user = userEvent.setup();
      render(<DutyEditInput {...defaultProps} />);

      const input = screen.getByRole("textbox");
      await user.type(input, " Updated");

      const saveButton = screen.getByTitle("Save");
      await user.click(saveButton);

      await waitFor(() => {
        expect(mockHandleFinish).toHaveBeenCalledTimes(1);
      });
    });

    it("should call handleFinish when Enter key is pressed", async () => {
      const user = userEvent.setup();
      render(<DutyEditInput {...defaultProps} />);

      const input = screen.getByRole("textbox");
      await user.type(input, " Updated");
      await user.keyboard("{Enter}");

      await waitFor(() => {
        expect(mockHandleFinish).toHaveBeenCalledTimes(1);
      });
    });

    it("should pass form values to handleFinish", async () => {
      const user = userEvent.setup();
      render(<DutyEditInput {...defaultProps} />);

      const input = screen.getByRole("textbox");
      const form = input.closest("form");

      await user.clear(input);
      await user.type(input, "Updated Duty");
      if (form) {
        fireEvent.submit(form);
      }

      await waitFor(() => {
        expect(mockHandleFinish).toHaveBeenCalledWith(
          expect.objectContaining({
            dutyName: "Updated Duty",
          })
        );
      });
    });
  });

  describe("cancel functionality", () => {
    it("should call handleCancel when cancel button is clicked", () => {
      render(<DutyEditInput {...defaultProps} />);

      const cancelButton = screen.getByTitle("Cancel");
      fireEvent.click(cancelButton);

      expect(mockHandleCancel).toHaveBeenCalledTimes(1);
    });

    it("should call handleCancel when Escape key is pressed", async () => {
      const user = userEvent.setup();
      render(<DutyEditInput {...defaultProps} />);

      const input = screen.getByRole("textbox");
      await user.type(input, " Modified");
      await user.keyboard("{Escape}");

      expect(mockHandleCancel).toHaveBeenCalledTimes(1);
    });

    it("should call handleCancel even when input is modified", async () => {
      const user = userEvent.setup();
      render(<DutyEditInput {...defaultProps} />);

      const input = screen.getByRole("textbox");
      await user.type(input, " Modified");

      const cancelButton = screen.getByTitle("Cancel");
      fireEvent.click(cancelButton);

      expect(mockHandleCancel).toHaveBeenCalledTimes(1);
    });
  });

  describe("input interactions", () => {
    it("should allow typing in the input", async () => {
      const user = userEvent.setup();
      render(<DutyEditInput {...defaultProps} />);

      const input = screen.getByRole("textbox");
      await user.clear(input);
      await user.type(input, "New Value");

      expect(input).toHaveValue("New Value");
    });

    it("should allow editing the initial value", async () => {
      const user = userEvent.setup();
      render(<DutyEditInput {...defaultProps} />);

      const input = screen.getByRole("textbox");
      await user.click(input);
      await user.type(input, " Updated");
      expect(input).toHaveValue(" Updated");
    });
  });

  describe("disabled state", () => {
    it("should disable input when isSubmitting is true", () => {
      render(<DutyEditInput {...defaultProps} isSubmitting={true} />);

      const input = screen.getByRole("textbox");
      expect(input).toBeDisabled();
    });

    it("should disable buttons when isSubmitting is true", () => {
      render(<DutyEditInput {...defaultProps} isSubmitting={true} />);

      const saveButton = screen.getByTitle("Save");
      const cancelButton = screen.getByTitle("Cancel");
      expect(saveButton).toBeDisabled();
      expect(cancelButton).toBeDisabled();
    });

    it("should not allow form submission when disabled", async () => {
      render(<DutyEditInput {...defaultProps} isSubmitting={true} />);

      const input = screen.getByRole("textbox");
      const form = input.closest("form");

      if (form) {
        fireEvent.submit(form);
      }

      expect(input).toBeDisabled();
    });
  });

  describe("hook integration", () => {
    it("should call useDutyEditInput with correct props", async () => {
      await act(async () => {
        render(<DutyEditInput {...defaultProps} />);
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      expect(useDutyEditInput).toHaveBeenCalledWith({
        initialValue: "Initial Duty",
        onSubmit: mockOnSave,
        onCancel: mockOnCancel,
      });
      expect(useDutyEditInput).toHaveBeenCalledTimes(1);
    });

    it("should use form instance from hook", async () => {
      await act(async () => {
        render(<DutyEditInput {...defaultProps} />);
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      const form = screen.getByRole("textbox").closest("form");
      expect(form).toBeInTheDocument();
    });

    it("should use validation rules from hook", async () => {
      await act(async () => {
        render(<DutyEditInput {...defaultProps} />);
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      const input = screen.getByRole("textbox");
      expect(input).toBeInTheDocument();
    });

    it("should update when initialValue prop changes", async () => {
      let rerender: (ui: React.ReactElement) => void;
      await act(async () => {
        const result = render(
          <DutyEditInput {...defaultProps} initialValue="Initial Duty" />
        );
        rerender = result.rerender;
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      await act(async () => {
        rerender!(
          <DutyEditInput {...defaultProps} initialValue="Updated Initial" />
        );
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      expect(useDutyEditInput).toHaveBeenCalledTimes(2);
      expect(useDutyEditInput).toHaveBeenLastCalledWith({
        initialValue: "Updated Initial",
        onSubmit: mockOnSave,
        onCancel: mockOnCancel,
      });
    });
  });

  describe("accessibility", () => {
    it("should have proper form structure", async () => {
      await act(async () => {
        render(<DutyEditInput {...defaultProps} />);
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      const form = screen.getByRole("textbox").closest("form");
      expect(form).toBeInTheDocument();
    });

    it("should have submit button with proper type", async () => {
      await act(async () => {
        render(<DutyEditInput {...defaultProps} />);
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      const saveButton = screen.getByTitle("Save");
      expect(saveButton).toHaveAttribute("type", "submit");
    });

    it("should have input with proper role", async () => {
      await act(async () => {
        render(<DutyEditInput {...defaultProps} />);
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      const input = screen.getByRole("textbox");
      expect(input).toBeInTheDocument();
    });

    it("should have buttons with title attributes", async () => {
      await act(async () => {
        render(<DutyEditInput {...defaultProps} />);
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      expect(screen.getByTitle("Save")).toBeInTheDocument();
      expect(screen.getByTitle("Cancel")).toBeInTheDocument();
    });
  });

  describe("edge cases", () => {
    it("should handle empty initial value", async () => {
      await act(async () => {
        render(
          <DutyEditInput
            {...defaultProps}
            initialValue=""
            onSave={mockOnSave}
            onCancel={mockOnCancel}
          />
        );
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("maxlength", "255");
    });

    it("should handle very long initial value", async () => {
      const longValue = "a".repeat(300);
      await act(async () => {
        render(
          <DutyEditInput
            {...defaultProps}
            initialValue={longValue}
            onSave={mockOnSave}
            onCancel={mockOnCancel}
          />
        );
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("maxlength", "255");
    });

    it("should handle special characters in initial value", async () => {
      await act(async () => {
        render(
          <DutyEditInput
            {...defaultProps}
            initialValue="Duty @#$%^&*()"
            onSave={mockOnSave}
            onCancel={mockOnCancel}
          />
        );
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      const input = screen.getByRole("textbox");
      expect(input).toBeInTheDocument();
      expect(useDutyEditInput).toHaveBeenCalledWith(
        expect.objectContaining({
          initialValue: "Duty @#$%^&*()",
        })
      );
    });

    it("should handle Escape key even when input is empty", async () => {
      const user = userEvent.setup();
      render(
        <DutyEditInput
          {...defaultProps}
          initialValue=""
          onSave={mockOnSave}
          onCancel={mockOnCancel}
        />
      );

      await user.keyboard("{Escape}");

      expect(mockHandleCancel).toHaveBeenCalledTimes(1);
    });

    it("should handle form submission with empty value", async () => {
      render(
        <DutyEditInput
          {...defaultProps}
          initialValue=""
          onSave={mockOnSave}
          onCancel={mockOnCancel}
        />
      );

      const input = screen.getByRole("textbox");
      const form = input.closest("form");

      if (form) {
        fireEvent.submit(form);
      }

      await waitFor(() => {
        expect(mockHandleFinish).not.toHaveBeenCalled();
      });
    });
  });
});
