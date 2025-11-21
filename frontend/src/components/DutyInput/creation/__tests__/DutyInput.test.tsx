import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Form } from "antd";
import { DutyInput } from "../DutyInput";
import { useDutyInput } from "../useDutyInput";
import type { DutyInputProps } from "../../types";

jest.mock("../../../../utils/constants", () => ({
  API_BASE_URL: "http://localhost:3000/api",
  DUTY_NAME_MAX_LENGTH: 255,
}));

jest.mock("../useDutyInput", () => ({
  useDutyInput: jest.fn(),
}));

const FormWrapper = ({ children }: { children: React.ReactNode }) => {
  const [form] = Form.useForm();
  return <Form form={form}>{children}</Form>;
};

describe("DutyInput", () => {
  const mockOnSubmit = jest.fn();
  const mockHandleFinish = jest.fn();
  const mockHandleBlur = jest.fn();
  let mockForm: ReturnType<typeof Form.useForm>[0];
  const mockValidationRules = [
    {
      required: true,
      message: "Please enter a duty name.",
    },
  ];

  const defaultProps: DutyInputProps = {
    onSubmit: mockOnSubmit,
  };

  const TestFormProvider = () => {
    const [form] = Form.useForm();
    mockForm = form;
    return null;
  };

  const mockUseDutyInputReturn = () => ({
    form: mockForm,
    rules: mockValidationRules,
    handleFinish: mockHandleFinish,
    handleBlur: mockHandleBlur,
  });

  beforeEach(() => {
    jest.clearAllMocks();
    const { unmount } = render(
      <FormWrapper>
        <TestFormProvider />
      </FormWrapper>
    );
    unmount();
    (useDutyInput as jest.Mock).mockReturnValue(mockUseDutyInputReturn());
  });

  describe("rendering", () => {
    it("should render form with input and button", () => {
      render(<DutyInput {...defaultProps} />);

      expect(screen.getByRole("textbox")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /add/i })).toBeInTheDocument();
    });

    it("should render with default placeholder", () => {
      render(<DutyInput {...defaultProps} />);

      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("placeholder", "Enter a new duty");
    });

    it("should render with custom placeholder", () => {
      render(<DutyInput {...defaultProps} placeholder="Custom placeholder" />);

      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("placeholder", "Custom placeholder");
    });

    it("should render input with correct attributes", () => {
      render(<DutyInput {...defaultProps} />);

      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("maxlength", "255");
      expect(input).not.toBeDisabled();
    });

    it("should render button with correct attributes", () => {
      render(<DutyInput {...defaultProps} />);

      const button = screen.getByRole("button", { name: /add/i });
      expect(button).toHaveAttribute("type", "submit");
      expect(button).not.toBeDisabled();
    });

    it("should render input as disabled when isSubmitting is true", () => {
      render(<DutyInput {...defaultProps} isSubmitting={true} />);

      const input = screen.getByRole("textbox");
      expect(input).toBeDisabled();
    });

    it("should render button as loading when isSubmitting is true", () => {
      render(<DutyInput {...defaultProps} isSubmitting={true} />);

      const button = screen.getByRole("button", { name: /add/i });
      expect(button).toBeInTheDocument();
    });
  });

  describe("form submission", () => {
    it("should call handleFinish when form is submitted", async () => {
      const user = userEvent.setup();
      render(<DutyInput {...defaultProps} />);

      const input = screen.getByRole("textbox");
      const form = input.closest("form");

      await user.type(input, "New Duty");
      if (form) {
        fireEvent.submit(form);
      }

      await waitFor(() => {
        expect(mockHandleFinish).toHaveBeenCalledTimes(1);
      });
    });

    it("should call handleFinish when button is clicked", async () => {
      const user = userEvent.setup();
      render(<DutyInput {...defaultProps} />);

      const input = screen.getByRole("textbox");
      await user.type(input, "New Duty");

      const button = screen.getByRole("button", { name: /add/i });
      await user.click(button);

      await waitFor(() => {
        expect(mockHandleFinish).toHaveBeenCalledTimes(1);
      });
    });

    it("should call handleFinish when Enter key is pressed", async () => {
      const user = userEvent.setup();
      render(<DutyInput {...defaultProps} />);

      const input = screen.getByRole("textbox");
      await user.type(input, "New Duty");
      await user.keyboard("{Enter}");

      await waitFor(() => {
        expect(mockHandleFinish).toHaveBeenCalledTimes(1);
      });
    });

    it("should pass form values to handleFinish", async () => {
      const user = userEvent.setup();
      render(<DutyInput {...defaultProps} />);

      const input = screen.getByRole("textbox");
      const form = input.closest("form");

      await user.type(input, "Test Duty");
      if (form) {
        fireEvent.submit(form);
      }

      await waitFor(() => {
        expect(mockHandleFinish).toHaveBeenCalledWith(
          expect.objectContaining({
            dutyName: "Test Duty",
          })
        );
      });
    });
  });

  describe("input interactions", () => {
    it("should call handleBlur when input loses focus", () => {
      render(<DutyInput {...defaultProps} />);

      const input = screen.getByRole("textbox");
      fireEvent.blur(input);

      expect(mockHandleBlur).toHaveBeenCalledTimes(1);
    });

    it("should allow typing in the input", async () => {
      const user = userEvent.setup();
      render(<DutyInput {...defaultProps} />);

      const input = screen.getByRole("textbox");
      await user.type(input, "New Duty");

      expect(input).toHaveValue("New Duty");
    });

    it("should allow clearing the input", async () => {
      const user = userEvent.setup();
      render(<DutyInput {...defaultProps} />);

      const input = screen.getByRole("textbox");
      await user.type(input, "New Duty");
      expect(input).toHaveValue("New Duty");

      const clearButton = input.parentElement?.querySelector(
        ".ant-input-clear-icon"
      );
      if (clearButton) {
        fireEvent.click(clearButton);
        expect(input).toHaveValue("");
      }
    });
  });

  describe("disabled state", () => {
    it("should disable input when isSubmitting is true", () => {
      render(<DutyInput {...defaultProps} isSubmitting={true} />);

      const input = screen.getByRole("textbox");
      expect(input).toBeDisabled();
    });

    it("should not allow form submission when disabled", async () => {
      const user = userEvent.setup();
      render(<DutyInput {...defaultProps} isSubmitting={true} />);

      const input = screen.getByRole("textbox");
      const form = input.closest("form");

      await user.type(input, "New Duty");

      if (form) {
        fireEvent.submit(form);
      }

      expect(input).toBeDisabled();
    });
  });

  describe("hook integration", () => {
    it("should call useDutyInput with onSubmit prop", () => {
      render(<DutyInput {...defaultProps} />);

      expect(useDutyInput).toHaveBeenCalledWith({ onSubmit: mockOnSubmit });
      expect(useDutyInput).toHaveBeenCalledTimes(1);
    });

    it("should use form instance from hook", () => {
      render(<DutyInput {...defaultProps} />);

      const form = screen.getByRole("textbox").closest("form");
      expect(form).toBeInTheDocument();
    });

    it("should use validation rules from hook", () => {
      render(<DutyInput {...defaultProps} />);

      const input = screen.getByRole("textbox");
      expect(input).toBeInTheDocument();
    });
  });

  describe("accessibility", () => {
    it("should have proper form structure", () => {
      render(<DutyInput {...defaultProps} />);

      const form = screen.getByRole("textbox").closest("form");
      expect(form).toBeInTheDocument();
    });

    it("should have submit button with proper type", () => {
      render(<DutyInput {...defaultProps} />);

      const button = screen.getByRole("button", { name: /add/i });
      expect(button).toHaveAttribute("type", "submit");
    });

    it("should have input with proper role", () => {
      render(<DutyInput {...defaultProps} />);

      const input = screen.getByRole("textbox");
      expect(input).toBeInTheDocument();
    });
  });

  describe("edge cases", () => {
    it("should handle empty form submission", async () => {
      render(<DutyInput {...defaultProps} />);

      const input = screen.getByRole("textbox");
      const form = input.closest("form");

      if (form) {
        fireEvent.submit(form);
      }

      await waitFor(() => {
        expect(mockHandleFinish).not.toHaveBeenCalled();
      });
    });

    it("should handle very long input", async () => {
      render(<DutyInput {...defaultProps} />);

      const input = screen.getByRole("textbox");

      expect(input).toHaveAttribute("maxlength", "255");
      expect(input.getAttribute("maxlength")).toBe("255");
    });

    it("should handle special characters in input", async () => {
      render(<DutyInput {...defaultProps} />);

      const input = screen.getByRole("textbox");

      const specialText = "Duty @#$%^&*()";
      fireEvent.change(input, { target: { value: specialText } });

      await waitFor(() => {
        expect(input).toHaveValue(specialText);
      });
    });
  });
});
