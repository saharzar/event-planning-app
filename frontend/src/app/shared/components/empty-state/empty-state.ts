import { Component, input } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  template: `
    <div class="empty-state text-center py-5 px-3">
      <i [class]="icon() + ' display-4 text-muted mb-3'"></i>
      <h3 class="h5 fw-bold text-slate-900">{{ title() }}</h3>
      <p class="text-secondary mb-0">{{ description() }}</p>
    </div>
  `,
  styleUrl: './empty-state.scss',
})
export class EmptyState {
  readonly icon = input('bi bi-inbox');
  readonly title = input('Nothing here yet');
  readonly description = input('Check back later.');
}
