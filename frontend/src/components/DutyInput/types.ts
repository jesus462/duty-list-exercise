export interface DutyInputProps {
  placeholder?: string;
  isSubmitting?: boolean;
  onSubmit: (value: string) => Promise<void> | void;
}

export interface DutyFormValues {
  dutyName: string;
}

export interface UseDutyInputParams {
  onSubmit: (value: string) => Promise<void> | void;
}
