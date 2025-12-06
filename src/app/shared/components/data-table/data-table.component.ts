import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule, TablePageEvent } from 'primeng/table';
import { TableColumn } from '../../models/table-column.model';

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

  pageChange = output<{ page: number; rows: number }>();

  onPageChange(event: TablePageEvent): void {
    const page = Math.floor((event.first ?? 0) / (event.rows ?? 10)) + 1;
    this.pageChange.emit({ page, rows: event.rows ?? 10 });
  }

  getNestedValue(obj: T, path: string): string | number | null {
    const value = path.split('.').reduce((o: unknown, key: string) => {
      return o && typeof o === 'object' ? (o as Record<string, unknown>)[key] : undefined;
    }, obj);
    return value as string | number | null;
  }
}
