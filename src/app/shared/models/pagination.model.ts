export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginationState {
  page: number;
  rows: number;
  totalRecords: number;
}

export interface PageChangeEvent {
  page: number;
  rows: number;
}
