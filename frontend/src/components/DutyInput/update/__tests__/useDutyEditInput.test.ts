import { renderHook, act, waitFor } from "@testing-library/react";
import { Form } from "antd";
import { useDutyEditInput } from "../useDutyEditInput";
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

describe("useDutyEditInput", () => {
  const mockOnSubmit = jest.fn();
  const mockOnCancel = jest.fn();
  const mockForm = {
    setFieldsValue: jest.fn(),
    resetFields: jest.fn(),
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
        useDutyEditInput({
          initialValue: "Initial Duty",
          onSubmit: mockOnSubmit,
          onCancel: mockOnCancel,
        })
      );

      expect(result.current.form).toBe(mockForm);
      expect(Form.useForm).toHaveBeenCalledTimes(1);
    });

    it("should return validation rules from useDutyValidation", () => {
      const { result } = renderHook(() =>
        useDutyEditInput({
          initialValue: "Initial Duty",
          onSubmit: mockOnSubmit,
          onCancel: mockOnCancel,
        })
      );

      expect(result.current.rules).toBe(mockValidationRules);
      expect(useDutyValidation).toHaveBeenCalledTimes(1);
    });

    it("should set initial value in form on mount", () => {
      renderHook(() =>
        useDutyEditInput({
          initialValue: "Initial Duty",
          onSubmit: mockOnSubmit,
          onCancel: mockOnCancel,
        })
      );

      expect(mockForm.setFieldsValue).toHaveBeenCalledWith({
        dutyName: "Initial Duty",
      });
    });
  });

  describe("useEffect - initialValue updates", () => {
    it("should update form value when initialValue changes", () => {
      const { rerender } = renderHook(
        ({ initialValue }) =>
          useDutyEditInput({
            initialValue,
            onSubmit: mockOnSubmit,
            onCancel: mockOnCancel,
          }),
        {
          initialProps: {
            initialValue: "Initial Duty",
          },
        }
      );

      expect(mockForm.setFieldsValue).toHaveBeenCalledWith({
        dutyName: "Initial Duty",
      });

      rerender({ initialValue: "Updated Duty" });

      expect(mockForm.setFieldsValue).toHaveBeenCalledWith({
        dutyName: "Updated Duty",
      });
      expect(mockForm.setFieldsValue).toHaveBeenCalledTimes(2);
    });

    it("should update form value when initialValue changes to empty string", () => {
      const { rerender } = renderHook(
        ({ initialValue }) =>
          useDutyEditInput({
            initialValue,
            onSubmit: mockOnSubmit,
            onCancel: mockOnCancel,
          }),
        {
          initialProps: {
            initialValue: "Initial Duty",
          },
        }
      );

      rerender({ initialValue: "" });

      expect(mockForm.setFieldsValue).toHaveBeenCalledWith({
        dutyName: "",
      });
    });
  });

  describe("handleFinish", () => {
    it("should call onSubmit with trimmed value", async () => {
      mockOnSubmit.mockResolvedValue(undefined);
      const { result } = renderHook(() =>
        useDutyEditInput({
          initialValue: "Initial Duty",
          onSubmit: mockOnSubmit,
          onCancel: mockOnCancel,
        })
      );

      await act(async () => {
        await result.current.handleFinish({ dutyName: "  Test Duty  " });
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      expect(mockOnSubmit).toHaveBeenCalledWith("Test Duty");
      expect(mockOnSubmit).toHaveBeenCalledTimes(1);
    });

    it("should handle async onSubmit", async () => {
      let resolveSubmit: () => void;
      const submitPromise = new Promise<void>((resolve) => {
        resolveSubmit = resolve;
      });
      mockOnSubmit.mockReturnValue(submitPromise);

      const { result } = renderHook(() =>
        useDutyEditInput({
          initialValue: "Initial Duty",
          onSubmit: mockOnSubmit,
          onCancel: mockOnCancel,
        })
      );

      let finishPromise: Promise<void>;
      await act(async () => {
        finishPromise = result.current.handleFinish({
          dutyName: "Test Duty",
        });
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      expect(mockOnSubmit).toHaveBeenCalledWith("Test Duty");

      await act(async () => {
        resolveSubmit!();
        await finishPromise!;
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledTimes(1);
      });
    });

    it("should not call onSubmit if trimmed value is empty", async () => {
      const { result } = renderHook(() =>
        useDutyEditInput({
          initialValue: "Initial Duty",
          onSubmit: mockOnSubmit,
          onCancel: mockOnCancel,
        })
      );

      await act(async () => {
        await result.current.handleFinish({ dutyName: "   " });
      });

      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it("should not call onSubmit if value is empty string", async () => {
      const { result } = renderHook(() =>
        useDutyEditInput({
          initialValue: "Initial Duty",
          onSubmit: mockOnSubmit,
          onCancel: mockOnCancel,
        })
      );

      await act(async () => {
        await result.current.handleFinish({ dutyName: "" });
      });

      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it("should propagate onSubmit errors", async () => {
      const error = new Error("Submit failed");
      mockOnSubmit.mockRejectedValue(error);

      const { result } = renderHook(() =>
        useDutyEditInput({
          initialValue: "Initial Duty",
          onSubmit: mockOnSubmit,
          onCancel: mockOnCancel,
        })
      );

      await act(async () => {
        await expect(
          result.current.handleFinish({ dutyName: "Test Duty" })
        ).rejects.toThrow("Submit failed");
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      expect(mockOnSubmit).toHaveBeenCalledWith("Test Duty");
    });

    it("should handle synchronous onSubmit", async () => {
      mockOnSubmit.mockReturnValue(undefined);
      const { result } = renderHook(() =>
        useDutyEditInput({
          initialValue: "Initial Duty",
          onSubmit: mockOnSubmit,
          onCancel: mockOnCancel,
        })
      );

      await act(async () => {
        await result.current.handleFinish({ dutyName: "Test Duty" });
      });

      expect(mockOnSubmit).toHaveBeenCalledWith("Test Duty");
      expect(mockOnSubmit).toHaveBeenCalledTimes(1);
    });

    it("should trim value before calling onSubmit", async () => {
      mockOnSubmit.mockResolvedValue(undefined);
      const { result } = renderHook(() =>
        useDutyEditInput({
          initialValue: "Initial Duty",
          onSubmit: mockOnSubmit,
          onCancel: mockOnCancel,
        })
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

  describe("handleCancel", () => {
    it("should reset form field and call onCancel", () => {
      const { result } = renderHook(() =>
        useDutyEditInput({
          initialValue: "Initial Duty",
          onSubmit: mockOnSubmit,
          onCancel: mockOnCancel,
        })
      );

      act(() => {
        result.current.handleCancel();
      });

      expect(mockForm.setFieldsValue).toHaveBeenCalledWith({
        dutyName: "Initial Duty",
      });
      expect(mockForm.resetFields).toHaveBeenCalledWith(["dutyName"]);
      expect(mockOnCancel).toHaveBeenCalledTimes(1);
    });

    it("should reset form to initial value even if form was modified", () => {
      const { result } = renderHook(() =>
        useDutyEditInput({
          initialValue: "Initial Duty",
          onSubmit: mockOnSubmit,
          onCancel: mockOnCancel,
        })
      );

      act(() => {
        result.current.handleCancel();
      });

      expect(mockForm.setFieldsValue).toHaveBeenCalledWith({
        dutyName: "Initial Duty",
      });
      expect(mockForm.resetFields).toHaveBeenCalledWith(["dutyName"]);
    });

    it("should handle cancel when initialValue is empty", () => {
      const { result } = renderHook(() =>
        useDutyEditInput({
          initialValue: "",
          onSubmit: mockOnSubmit,
          onCancel: mockOnCancel,
        })
      );

      act(() => {
        result.current.handleCancel();
      });

      expect(mockForm.setFieldsValue).toHaveBeenCalledWith({
        dutyName: "",
      });
      expect(mockForm.resetFields).toHaveBeenCalledWith(["dutyName"]);
      expect(mockOnCancel).toHaveBeenCalledTimes(1);
    });

    it("should update form value when initialValue changes after cancel", () => {
      const { result, rerender } = renderHook(
        ({ initialValue }) =>
          useDutyEditInput({
            initialValue,
            onSubmit: mockOnSubmit,
            onCancel: mockOnCancel,
          }),
        {
          initialProps: {
            initialValue: "Initial Duty",
          },
        }
      );

      act(() => {
        result.current.handleCancel();
      });

      rerender({ initialValue: "New Initial Duty" });

      act(() => {
        result.current.handleCancel();
      });

      expect(mockForm.setFieldsValue).toHaveBeenLastCalledWith({
        dutyName: "New Initial Duty",
      });
    });
  });

  describe("callbacks stability", () => {
    it("should return stable handleFinish callback on re-render with same onSubmit", () => {
      const { result, rerender } = renderHook(
        ({ onSubmit }) =>
          useDutyEditInput({
            initialValue: "Initial Duty",
            onSubmit,
            onCancel: mockOnCancel,
          }),
        {
          initialProps: {
            onSubmit: mockOnSubmit,
          },
        }
      );

      const firstHandleFinish = result.current.handleFinish;

      rerender({ onSubmit: mockOnSubmit });

      expect(result.current.handleFinish).toBe(firstHandleFinish);
    });

    it("should return new handleFinish callback when onSubmit changes", () => {
      const { result, rerender } = renderHook(
        ({ onSubmit }) =>
          useDutyEditInput({
            initialValue: "Initial Duty",
            onSubmit,
            onCancel: mockOnCancel,
          }),
        {
          initialProps: {
            onSubmit: mockOnSubmit,
          },
        }
      );

      const firstHandleFinish = result.current.handleFinish;
      const newOnSubmit = jest.fn();

      rerender({ onSubmit: newOnSubmit });

      expect(result.current.handleFinish).not.toBe(firstHandleFinish);
    });

    it("should return stable handleCancel callback on re-render with same props", () => {
      const { result, rerender } = renderHook(
        ({ initialValue, onCancel }) =>
          useDutyEditInput({
            initialValue,
            onSubmit: mockOnSubmit,
            onCancel,
          }),
        {
          initialProps: {
            initialValue: "Initial Duty",
            onCancel: mockOnCancel,
          },
        }
      );

      const firstHandleCancel = result.current.handleCancel;

      rerender({
        initialValue: "Initial Duty",
        onCancel: mockOnCancel,
      });

      expect(result.current.handleCancel).toBe(firstHandleCancel);
    });

    it("should return new handleCancel callback when onCancel changes", () => {
      const { result, rerender } = renderHook(
        ({ onCancel }) =>
          useDutyEditInput({
            initialValue: "Initial Duty",
            onSubmit: mockOnSubmit,
            onCancel,
          }),
        {
          initialProps: {
            onCancel: mockOnCancel,
          },
        }
      );

      const firstHandleCancel = result.current.handleCancel;
      const newOnCancel = jest.fn();

      rerender({ onCancel: newOnCancel });

      expect(result.current.handleCancel).not.toBe(firstHandleCancel);
    });

    it("should return new handleCancel callback when initialValue changes", () => {
      const { result, rerender } = renderHook(
        ({ initialValue }) =>
          useDutyEditInput({
            initialValue,
            onSubmit: mockOnSubmit,
            onCancel: mockOnCancel,
          }),
        {
          initialProps: {
            initialValue: "Initial Duty",
          },
        }
      );

      const firstHandleCancel = result.current.handleCancel;

      rerender({ initialValue: "New Initial Duty" });

      expect(result.current.handleCancel).not.toBe(firstHandleCancel);
    });
  });
});
