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

export interface DutyEditInputProps {
  initialValue: string;
  onSave: (value: string) => Promise<void> | void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export interface UseDutyEditInputParams {
  initialValue: string;
  onSubmit: (value: string) => Promise<void> | void;
  onCancel: () => void;
}
