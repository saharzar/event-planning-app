import { Component, computed, input } from '@angular/core';
import { getEventCountdown } from '../../../core/utils/event-countdown.util';

@Component({
  selector: 'app-countdown-badge',
  standalone: true,
  template: `<span class="countdown-badge" [class]="'countdown-' + variant()">{{ label() }}</span>`,
  styleUrl: './countdown-badge.scss',
})
export class CountdownBadge {
  readonly date = input.required<string>();
  readonly time = input<string>();

  private readonly countdown = computed(() => getEventCountdown(this.date(), this.time()));

  readonly label = computed(() => this.countdown().label);
  readonly variant = computed(() => this.countdown().variant);
}
