import { Component, DestroyRef, inject, input, output, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-search-input',
  standalone: true,
  imports: [InputTextModule, IconFieldModule, InputIconModule],
  templateUrl: './search-input.component.html',
})
export class SearchInputComponent {
  private readonly destroyRef = inject(DestroyRef);

  readonly placeholder = input<string>('Search...');
  readonly debounceMs = input<number>(300);
  readonly value = input<string>('');

  readonly searchChange = output<string>();

  // Internal signal for input value
  readonly inputValue = signal('');

  // Subject for debounced search
  private readonly searchSubject = new Subject<string>();

  constructor() {
    // Set up debounced search pipeline
    this.searchSubject.pipe(
      debounceTime(this.debounceMs()),
      distinctUntilChanged(),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe((value) => {
      this.searchChange.emit(value);
    });
  }

  onInput(event: Event): void {
    const inputValue = (event.target as HTMLInputElement).value;
    this.inputValue.set(inputValue);
    this.searchSubject.next(inputValue);
  }
}
