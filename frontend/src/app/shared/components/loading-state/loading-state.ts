import { Component, input } from '@angular/core';

@Component({
  selector: 'app-loading-state',
  standalone: true,
  template: `
    <div class="loading-state text-center py-5" [class.py-3]="compact()">
      <div class="spinner-border text-primary" role="status" aria-hidden="true"></div>
      <p class="mt-3 mb-0 text-secondary">{{ message() }}</p>
    </div>
  `,
})
export class LoadingState {
  readonly message = input('Loading...');
  readonly compact = input(false);
}

