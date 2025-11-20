import type { Duty } from "../../services/types";

export interface DutyListProps {
  duties: Duty[];
  isLoading?: boolean;
  isSubmitting?: boolean;
  onUpdate?: (id: number, name: string) => Promise<void>;
  onDelete?: (duty: Duty) => void;
}

export interface UseDutyListParams {
  duties: Duty[];
  onUpdate?: (id: number, name: string) => Promise<void>;
}
