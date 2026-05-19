import { Component, computed, input } from '@angular/core';
import { EventStatus } from '../../../core/models/event-api.model';
import { isEventEnded } from '../../../core/utils/event-countdown.util';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  template: `<span class="status-badge" [class]="badgeClass()">{{ displayLabel() }}</span>`,
  styleUrl: './status-badge.scss',
})
export class StatusBadge {
  readonly status = input.required<EventStatus>();
  readonly date = input<string>();
  readonly time = input<string>();

  readonly ended = computed(() => {
    const d = this.date();
    return d ? isEventEnded(d, this.time()) : false;
  });

  readonly displayLabel = computed(() => {
    if (this.ended()) return 'Ended';
    return this.status();
  });

  readonly badgeClass = computed(() => {
    if (this.ended()) return 'status-ended';
    return `status-${this.status().toLowerCase()}`;
  });
}
