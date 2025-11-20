import { useMemo } from "react";
import { DUTY_NAME_MAX_LENGTH } from "../../utils/constants";

export const useDutyValidation = () => {
  const validationRules = useMemo(
    () => [
      {
        required: true,
        message: "Please enter a duty name.",
      },
      {
        validator: (_: unknown, value?: string) => {
          const trimmedValue = value?.trim() || "";
          if (!trimmedValue) {
            return Promise.reject(
              new Error("Duty name cannot be only spaces.")
            );
          }
          if (trimmedValue.length > DUTY_NAME_MAX_LENGTH) {
            return Promise.reject(
              new Error(
                `Duty name must be ${DUTY_NAME_MAX_LENGTH} characters or fewer.`
              )
            );
          }
          return Promise.resolve();
        },
      },
    ],
    []
  );

  const validateValue = (
    value: string
  ): { isValid: boolean; error?: string } => {
    const trimmedValue = value.trim();

    if (!trimmedValue) {
      return { isValid: false, error: "Duty name cannot be empty." };
    }

    if (trimmedValue.length > DUTY_NAME_MAX_LENGTH) {
      return {
        isValid: false,
        error: `Duty name must be ${DUTY_NAME_MAX_LENGTH} characters or fewer.`,
      };
    }

    return { isValid: true };
  };

  return {
    validationRules,
    validateValue,
    maxLength: DUTY_NAME_MAX_LENGTH,
  };
};
