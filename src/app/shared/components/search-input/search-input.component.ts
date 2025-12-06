import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';

@Component({
  selector: 'app-search-input',
  standalone: true,
  imports: [CommonModule, InputTextModule, IconFieldModule, InputIconModule],
  templateUrl: './search-input.component.html',
})
export class SearchInputComponent {
  placeholder = input<string>('Search...');
  debounceTime = input<number>(300);
  value = input<string>('');

  searchChange = output<string>();

  private debounceTimer: ReturnType<typeof setTimeout> | null = null;

  onInput(event: Event): void {
    const inputValue = (event.target as HTMLInputElement).value;

    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }

    this.debounceTimer = setTimeout(() => {
      this.searchChange.emit(inputValue);
    }, this.debounceTime());
  }
}
