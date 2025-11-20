import type { Duty } from "../../services/types";

export interface DutyListProps {
  duties: Duty[];
  isLoading?: boolean;
  onEdit?: (duty: Duty) => void;
  onDelete?: (duty: Duty) => void;
}
