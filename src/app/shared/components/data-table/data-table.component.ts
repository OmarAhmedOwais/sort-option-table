import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule, TableLazyLoadEvent } from 'primeng/table';
import { TableColumn } from '../../models/table-column.model';

export interface SortEvent {
  field: string;
  order: 'asc' | 'desc';
}

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule, TableModule],
  templateUrl: './data-table.component.html',
})
export class DataTableComponent<T> {
  data = input.required<T[]>();
  columns = input.required<TableColumn[]>();
  loading = input<boolean>(false);
  paginator = input<boolean>(true);
  rows = input<number>(10);
  rowsPerPageOptions = input<number[]>([5, 10, 20]);
  totalRecords = input<number>(0);
  lazy = input<boolean>(false);
  first = input<number>(0);
  sortField = input<string>('');
  sortOrder = input<'asc' | 'desc'>('asc');

  pageChange = output<{ page: number; rows: number }>();
  sortChange = output<SortEvent>();

  onLazyLoad(event: TableLazyLoadEvent): void {
    // Handle pagination
    const page = Math.floor((event.first ?? 0) / (event.rows ?? 10)) + 1;
    this.pageChange.emit({ page, rows: event.rows ?? 10 });

    // Handle sorting
    if (event.sortField) {
      const field = Array.isArray(event.sortField) ? event.sortField[0] : event.sortField;
      const order = event.sortOrder === 1 ? 'asc' : 'desc';
      this.sortChange.emit({ field, order });
    }
  }

  getSortOrder(): number {
    return this.sortOrder() === 'asc' ? 1 : -1;
  }

  getNestedValue(obj: T, path: string): string | number | null {
    const value = path.split('.').reduce((o: unknown, key: string) => {
      return o && typeof o === 'object' ? (o as Record<string, unknown>)[key] : undefined;
    }, obj);
    return value as string | number | null;
  }
}
