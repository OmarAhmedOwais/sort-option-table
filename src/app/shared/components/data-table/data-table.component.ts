import { Component, computed, input, output, signal } from '@angular/core';
import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { TableModule, TableLazyLoadEvent } from 'primeng/table';
import { TableColumn } from '../../models/table-column.model';
import { SortEvent } from '../../models/sort-event.model';

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CurrencyPipe, DecimalPipe, TableModule],
  templateUrl: './data-table.component.html',
})
export class DataTableComponent<T> {
  readonly data = input.required<T[]>();
  readonly columns = input.required<TableColumn[]>();
  readonly loading = input<boolean>(false);
  readonly paginator = input<boolean>(true);
  readonly rows = input<number>(10);
  readonly rowsPerPageOptions = input<number[]>([5, 10, 20]);
  readonly totalRecords = input<number>(0);
  readonly lazy = input<boolean>(false);
  readonly first = input<number>(0);
  readonly sortField = input<string>('');
  readonly sortOrder = input<'asc' | 'desc'>('asc');

  readonly pageChange = output<{ page: number; rows: number }>();
  readonly sortChange = output<SortEvent>();

  // Computed sort order for PrimeNG (1 = asc, -1 = desc)
  readonly primeSortOrder = computed(() => this.sortOrder() === 'asc' ? 1 : -1);

  // Track last sort to avoid duplicate emissions
  private readonly lastSort = signal<{ field: string | null; order: number | null }>({ field: null, order: null });

  onLazyLoad(event: TableLazyLoadEvent): void {
    const currentRows = this.rows();
    const eventRows = event.rows ?? currentRows;
    const page = Math.floor((event.first ?? 0) / eventRows) + 1;

    // Emit page change
    this.pageChange.emit({ page, rows: eventRows });

    // Handle sorting - only emit if sort actually changed
    if (event.sortField) {
      const field = Array.isArray(event.sortField) ? event.sortField[0] : event.sortField;
      const order = event.sortOrder === 1 ? 'asc' : 'desc';
      const last = this.lastSort();

      if (field !== last.field || event.sortOrder !== last.order) {
        this.lastSort.set({ field, order: event.sortOrder ?? null });
        this.sortChange.emit({ field, order });
      }
    }
  }

  getNestedValue(obj: T, path: string): string | number | null {
    const value = path.split('.').reduce((o: unknown, key: string) => {
      return o && typeof o === 'object' ? (o as Record<string, unknown>)[key] : undefined;
    }, obj);
    return value as string | number | null;
  }
}
