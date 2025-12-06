import { TableColumn } from '../../../shared';

export const PRODUCTS_TABLE_COLUMNS: TableColumn[] = [
  { field: 'id', header: 'ID', sortable: true, width: '8%' },
  { field: 'title', header: 'Title', sortable: true, width: '25%' },
  { field: 'price', header: 'Price', sortable: true, width: '12%', type: 'currency' },
  { field: 'category', header: 'Category', sortable: true, width: '15%' },
  { field: 'brand', header: 'Brand', sortable: true, width: '12%' },
  { field: 'rating', header: 'Rating', sortable: true, width: '10%', type: 'rating' },
  { field: 'thumbnail', header: 'Image', sortable: false, width: '18%', type: 'image' },
];
