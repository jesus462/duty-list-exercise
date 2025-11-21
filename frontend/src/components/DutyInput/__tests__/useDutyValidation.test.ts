import { renderHook } from "@testing-library/react";
import { useDutyValidation } from "../useDutyValidation";

jest.mock("../../../utils/constants", () => ({
  DUTY_NAME_MAX_LENGTH: 255,
}));

describe("useDutyValidation", () => {
  describe("validationRules", () => {
    it("should return validation rules with required rule", () => {
      const { result } = renderHook(() => useDutyValidation());

      expect(result.current.validationRules).toHaveLength(2);
      expect(result.current.validationRules[0]).toEqual({
        required: true,
        message: "Please enter a duty name.",
      });
    });

    it("should return validation rules with validator function", () => {
      const { result } = renderHook(() => useDutyValidation());

      expect(result.current.validationRules[1]).toHaveProperty("validator");
      expect(typeof result.current.validationRules[1].validator).toBe(
        "function"
      );
    });

    it("should return the same validation rules on re-render (memoized)", () => {
      const { result, rerender } = renderHook(() => useDutyValidation());

      const firstRules = result.current.validationRules;

      rerender();

      expect(result.current.validationRules).toBe(firstRules);
    });

    describe("validator function", () => {
      it("should reject empty string", async () => {
        const { result } = renderHook(() => useDutyValidation());
        const validator = result.current.validationRules[1].validator!;

        await expect(validator(undefined, "")).rejects.toThrow(
          "Duty name cannot be only spaces."
        );
      });

      it("should reject whitespace-only string", async () => {
        const { result } = renderHook(() => useDutyValidation());
        const validator = result.current.validationRules[1].validator!;

        await expect(validator(undefined, "   ")).rejects.toThrow(
          "Duty name cannot be only spaces."
        );
      });

      it("should reject string with only tabs and newlines", async () => {
        const { result } = renderHook(() => useDutyValidation());
        const validator = result.current.validationRules[1].validator!;

        await expect(validator(undefined, "\t\n  \t")).rejects.toThrow(
          "Duty name cannot be only spaces."
        );
      });

      it("should accept valid string", async () => {
        const { result } = renderHook(() => useDutyValidation());
        const validator = result.current.validationRules[1].validator!;

        await expect(
          validator(undefined, "Valid Duty")
        ).resolves.toBeUndefined();
      });

      it("should accept string with leading/trailing whitespace (trimmed)", async () => {
        const { result } = renderHook(() => useDutyValidation());
        const validator = result.current.validationRules[1].validator!;

        await expect(
          validator(undefined, "  Valid Duty  ")
        ).resolves.toBeUndefined();
      });

      it("should reject string exceeding max length", async () => {
        const { result } = renderHook(() => useDutyValidation());
        const validator = result.current.validationRules[1].validator!;
        const longString = "a".repeat(256);

        await expect(validator(undefined, longString)).rejects.toThrow(
          "Duty name must be 255 characters or fewer."
        );
      });

      it("should accept string at max length", async () => {
        const { result } = renderHook(() => useDutyValidation());
        const validator = result.current.validationRules[1].validator!;
        const maxLengthString = "a".repeat(255);

        await expect(
          validator(undefined, maxLengthString)
        ).resolves.toBeUndefined();
      });

      it("should accept string just under max length", async () => {
        const { result } = renderHook(() => useDutyValidation());
        const validator = result.current.validationRules[1].validator!;
        const underMaxString = "a".repeat(254);

        await expect(
          validator(undefined, underMaxString)
        ).resolves.toBeUndefined();
      });

      it("should handle undefined value", async () => {
        const { result } = renderHook(() => useDutyValidation());
        const validator = result.current.validationRules[1].validator!;

        await expect(validator(undefined, undefined)).rejects.toThrow(
          "Duty name cannot be only spaces."
        );
      });

      it("should handle null value", async () => {
        const { result } = renderHook(() => useDutyValidation());
        const validator = result.current.validationRules[1].validator!;

        await expect(
          validator(undefined, null as unknown as string)
        ).rejects.toThrow("Duty name cannot be only spaces.");
      });
    });
  });

  describe("validateValue", () => {
    it("should return invalid for empty string", () => {
      const { result } = renderHook(() => useDutyValidation());

      const validation = result.current.validateValue("");

      expect(validation.isValid).toBe(false);
      expect(validation.error).toBe("Duty name cannot be empty.");
    });

    it("should return invalid for whitespace-only string", () => {
      const { result } = renderHook(() => useDutyValidation());

      const validation = result.current.validateValue("   ");

      expect(validation.isValid).toBe(false);
      expect(validation.error).toBe("Duty name cannot be empty.");
    });

    it("should return invalid for string with only tabs and newlines", () => {
      const { result } = renderHook(() => useDutyValidation());

      const validation = result.current.validateValue("\t\n  \t");

      expect(validation.isValid).toBe(false);
      expect(validation.error).toBe("Duty name cannot be empty.");
    });

    it("should return valid for valid string", () => {
      const { result } = renderHook(() => useDutyValidation());

      const validation = result.current.validateValue("Valid Duty");

      expect(validation.isValid).toBe(true);
      expect(validation.error).toBeUndefined();
    });

    it("should return valid for string with leading/trailing whitespace (trimmed)", () => {
      const { result } = renderHook(() => useDutyValidation());

      const validation = result.current.validateValue("  Valid Duty  ");

      expect(validation.isValid).toBe(true);
      expect(validation.error).toBeUndefined();
    });

    it("should return invalid for string exceeding max length", () => {
      const { result } = renderHook(() => useDutyValidation());
      const longString = "a".repeat(256);

      const validation = result.current.validateValue(longString);

      expect(validation.isValid).toBe(false);
      expect(validation.error).toBe(
        "Duty name must be 255 characters or fewer."
      );
    });

    it("should return valid for string at max length", () => {
      const { result } = renderHook(() => useDutyValidation());
      const maxLengthString = "a".repeat(255);

      const validation = result.current.validateValue(maxLengthString);

      expect(validation.isValid).toBe(true);
      expect(validation.error).toBeUndefined();
    });

    it("should return valid for string just under max length", () => {
      const { result } = renderHook(() => useDutyValidation());
      const underMaxString = "a".repeat(254);

      const validation = result.current.validateValue(underMaxString);

      expect(validation.isValid).toBe(true);
      expect(validation.error).toBeUndefined();
    });

    it("should handle string with special characters", () => {
      const { result } = renderHook(() => useDutyValidation());

      const validation = result.current.validateValue("Duty @#$%^&*()");

      expect(validation.isValid).toBe(true);
      expect(validation.error).toBeUndefined();
    });

    it("should handle string with unicode characters", () => {
      const { result } = renderHook(() => useDutyValidation());

      const validation = result.current.validateValue("Duty 测试 🎉");

      expect(validation.isValid).toBe(true);
      expect(validation.error).toBeUndefined();
    });
  });

  describe("maxLength", () => {
    it("should return the correct max length", () => {
      const { result } = renderHook(() => useDutyValidation());

      expect(result.current.maxLength).toBe(255);
    });
  });
});
