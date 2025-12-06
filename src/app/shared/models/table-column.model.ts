export interface TableColumn {
  field: string;
  header: string;
  sortable?: boolean;
  width?: string;
  type?: 'text' | 'currency' | 'image' | 'rating' | 'custom';
}
