import { renderHook, act, waitFor } from "@testing-library/react";
import { Form } from "antd";
import { useDutyInput } from "../useDutyInput";
import { useDutyValidation } from "../../useDutyValidation";

jest.mock("../../useDutyValidation", () => ({
  useDutyValidation: jest.fn(),
}));

jest.mock("antd", () => {
  const actual = jest.requireActual("antd");
  return {
    ...actual,
    Form: {
      ...actual.Form,
      useForm: jest.fn(),
    },
  };
});

describe("useDutyInput", () => {
  const mockOnSubmit = jest.fn();
  const mockForm = {
    resetFields: jest.fn(),
    getFieldValue: jest.fn(),
  };
  const mockValidationRules = [
    {
      required: true,
      message: "Please enter a duty name.",
    },
    {
      validator: jest.fn(),
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (Form.useForm as jest.Mock).mockReturnValue([mockForm]);
    (useDutyValidation as jest.Mock).mockReturnValue({
      validationRules: mockValidationRules,
    });
  });

  describe("initialization", () => {
    it("should return form instance", () => {
      const { result } = renderHook(() =>
        useDutyInput({ onSubmit: mockOnSubmit })
      );

      expect(result.current.form).toBe(mockForm);
      expect(Form.useForm).toHaveBeenCalledTimes(1);
    });

    it("should return validation rules from useDutyValidation", () => {
      const { result } = renderHook(() =>
        useDutyInput({ onSubmit: mockOnSubmit })
      );

      expect(result.current.rules).toBe(mockValidationRules);
      expect(useDutyValidation).toHaveBeenCalledTimes(1);
    });
  });

  describe("handleFinish", () => {
    it("should call onSubmit with trimmed value and reset form", async () => {
      mockOnSubmit.mockResolvedValue(undefined);
      const { result } = renderHook(() =>
        useDutyInput({ onSubmit: mockOnSubmit })
      );

      await act(async () => {
        await result.current.handleFinish({ dutyName: "  Test Duty  " });
      });

      expect(mockOnSubmit).toHaveBeenCalledWith("Test Duty");
      expect(mockOnSubmit).toHaveBeenCalledTimes(1);
      expect(mockForm.resetFields).toHaveBeenCalledTimes(1);
      expect(mockForm.resetFields).toHaveBeenCalledWith();
    });

    it("should handle async onSubmit", async () => {
      let resolveSubmit: () => void;
      const submitPromise = new Promise<void>((resolve) => {
        resolveSubmit = resolve;
      });
      mockOnSubmit.mockReturnValue(submitPromise);

      const { result } = renderHook(() =>
        useDutyInput({ onSubmit: mockOnSubmit })
      );

      let finishPromise: Promise<void>;
      await act(async () => {
        finishPromise = result.current.handleFinish({ dutyName: "Test Duty" });
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      expect(mockOnSubmit).toHaveBeenCalledWith("Test Duty");
      expect(mockForm.resetFields).not.toHaveBeenCalled();

      await act(async () => {
        resolveSubmit!();
        await finishPromise!;
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      await waitFor(() => {
        expect(mockForm.resetFields).toHaveBeenCalledTimes(1);
      });
    });

    it("should not call onSubmit if trimmed value is empty", async () => {
      const { result } = renderHook(() =>
        useDutyInput({ onSubmit: mockOnSubmit })
      );

      await act(async () => {
        await result.current.handleFinish({ dutyName: "   " });
      });

      expect(mockOnSubmit).not.toHaveBeenCalled();
      expect(mockForm.resetFields).not.toHaveBeenCalled();
    });

    it("should not call onSubmit if value is empty string", async () => {
      const { result } = renderHook(() =>
        useDutyInput({ onSubmit: mockOnSubmit })
      );

      await act(async () => {
        await result.current.handleFinish({ dutyName: "" });
      });

      expect(mockOnSubmit).not.toHaveBeenCalled();
      expect(mockForm.resetFields).not.toHaveBeenCalled();
    });

    it("should propagate onSubmit errors and not reset form", async () => {
      const error = new Error("Submit failed");
      mockOnSubmit.mockRejectedValue(error);

      const { result } = renderHook(() =>
        useDutyInput({ onSubmit: mockOnSubmit })
      );

      await act(async () => {
        await expect(
          result.current.handleFinish({ dutyName: "Test Duty" })
        ).rejects.toThrow("Submit failed");
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      expect(mockOnSubmit).toHaveBeenCalledWith("Test Duty");
      expect(mockForm.resetFields).not.toHaveBeenCalled();
    });

    it("should handle synchronous onSubmit", async () => {
      mockOnSubmit.mockReturnValue(undefined);
      const { result } = renderHook(() =>
        useDutyInput({ onSubmit: mockOnSubmit })
      );

      await act(async () => {
        await result.current.handleFinish({ dutyName: "Test Duty" });
      });

      expect(mockOnSubmit).toHaveBeenCalledWith("Test Duty");
      expect(mockForm.resetFields).toHaveBeenCalledTimes(1);
    });

    it("should trim value before calling onSubmit", async () => {
      mockOnSubmit.mockResolvedValue(undefined);
      const { result } = renderHook(() =>
        useDutyInput({ onSubmit: mockOnSubmit })
      );

      await act(async () => {
        await result.current.handleFinish({
          dutyName: "\t\n  Test Duty  \t\n",
        });
      });

      expect(mockOnSubmit).toHaveBeenCalledWith("Test Duty");
      expect(mockOnSubmit).not.toHaveBeenCalledWith("\t\n  Test Duty  \t\n");
    });
  });

  describe("handleBlur", () => {
    it("should reset field if value is empty", () => {
      (mockForm.getFieldValue as jest.Mock).mockReturnValue("");
      const { result } = renderHook(() =>
        useDutyInput({ onSubmit: mockOnSubmit })
      );

      act(() => {
        result.current.handleBlur();
      });

      expect(mockForm.getFieldValue).toHaveBeenCalledWith("dutyName");
      expect(mockForm.resetFields).toHaveBeenCalledWith(["dutyName"]);
    });

    it("should reset field if value is only whitespace", () => {
      (mockForm.getFieldValue as jest.Mock).mockReturnValue("   ");
      const { result } = renderHook(() =>
        useDutyInput({ onSubmit: mockOnSubmit })
      );

      act(() => {
        result.current.handleBlur();
      });

      expect(mockForm.getFieldValue).toHaveBeenCalledWith("dutyName");
      expect(mockForm.resetFields).toHaveBeenCalledWith(["dutyName"]);
    });

    it("should reset field if value is only tabs and newlines", () => {
      (mockForm.getFieldValue as jest.Mock).mockReturnValue("\t\n  \t");
      const { result } = renderHook(() =>
        useDutyInput({ onSubmit: mockOnSubmit })
      );

      act(() => {
        result.current.handleBlur();
      });

      expect(mockForm.getFieldValue).toHaveBeenCalledWith("dutyName");
      expect(mockForm.resetFields).toHaveBeenCalledWith(["dutyName"]);
    });

    it("should not reset field if value has content", () => {
      (mockForm.getFieldValue as jest.Mock).mockReturnValue("Test Duty");
      const { result } = renderHook(() =>
        useDutyInput({ onSubmit: mockOnSubmit })
      );

      act(() => {
        result.current.handleBlur();
      });

      expect(mockForm.getFieldValue).toHaveBeenCalledWith("dutyName");
      expect(mockForm.resetFields).not.toHaveBeenCalled();
    });

    it("should not reset field if value has content with whitespace", () => {
      (mockForm.getFieldValue as jest.Mock).mockReturnValue("  Test Duty  ");
      const { result } = renderHook(() =>
        useDutyInput({ onSubmit: mockOnSubmit })
      );

      act(() => {
        result.current.handleBlur();
      });

      expect(mockForm.getFieldValue).toHaveBeenCalledWith("dutyName");
      expect(mockForm.resetFields).not.toHaveBeenCalled();
    });

    it("should handle null/undefined value", () => {
      (mockForm.getFieldValue as jest.Mock).mockReturnValue(null);
      const { result } = renderHook(() =>
        useDutyInput({ onSubmit: mockOnSubmit })
      );

      act(() => {
        result.current.handleBlur();
      });

      expect(mockForm.getFieldValue).toHaveBeenCalledWith("dutyName");
      expect(mockForm.resetFields).toHaveBeenCalledWith(["dutyName"]);
    });

    it("should handle undefined value", () => {
      (mockForm.getFieldValue as jest.Mock).mockReturnValue(undefined);
      const { result } = renderHook(() =>
        useDutyInput({ onSubmit: mockOnSubmit })
      );

      act(() => {
        result.current.handleBlur();
      });

      expect(mockForm.getFieldValue).toHaveBeenCalledWith("dutyName");
      expect(mockForm.resetFields).toHaveBeenCalledWith(["dutyName"]);
    });
  });

  describe("callbacks stability", () => {
    it("should return stable handleFinish callback on re-render", () => {
      const { result, rerender } = renderHook(
        ({ onSubmit }) => useDutyInput({ onSubmit }),
        {
          initialProps: { onSubmit: mockOnSubmit },
        }
      );

      const firstHandleFinish = result.current.handleFinish;

      rerender({ onSubmit: mockOnSubmit });

      expect(result.current.handleFinish).toBe(firstHandleFinish);
    });

    it("should return new handleFinish callback when onSubmit changes", () => {
      const { result, rerender } = renderHook(
        ({ onSubmit }) => useDutyInput({ onSubmit }),
        {
          initialProps: { onSubmit: mockOnSubmit },
        }
      );

      const firstHandleFinish = result.current.handleFinish;
      const newOnSubmit = jest.fn();

      rerender({ onSubmit: newOnSubmit });

      expect(result.current.handleFinish).not.toBe(firstHandleFinish);
    });

    it("should return stable handleBlur callback on re-render", () => {
      const { result, rerender } = renderHook(
        ({ onSubmit }) => useDutyInput({ onSubmit }),
        {
          initialProps: { onSubmit: mockOnSubmit },
        }
      );

      const firstHandleBlur = result.current.handleBlur;

      rerender({ onSubmit: mockOnSubmit });

      expect(result.current.handleBlur).toBe(firstHandleBlur);
    });
  });
});
