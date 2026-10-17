export type Tone = "primary" | "success" | "warning" | "danger" | "info" | "muted";

export interface PaginationParams {
  page: number;
  pageSize: number;
  total: number;
}

export interface SelectOption<T = string> {
  label: string;
  value: T;
  disabled?: boolean;
}

export interface FilterState {
  search: string;
  status: string;
  dateRange?: string;
  sortBy?: string;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}
