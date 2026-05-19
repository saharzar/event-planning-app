import { Component, computed, effect, input, signal } from '@angular/core';

@Component({
  selector: 'app-event-cover',
  standalone: true,
  templateUrl: './event-cover.html',
  styleUrl: './event-cover.scss',
  host: {
    class: 'event-cover-host',
    '[class.event-cover-host--banner]': 'variant() === "banner"',
    '[class.event-cover-host--card]': 'variant() === "card"',
  },
})
export class EventCover {
  readonly src = input<string | null | undefined>(null);
  readonly alt = input('Event cover');
  readonly variant = input<'card' | 'banner'>('card');

  private readonly broken = signal(false);

  readonly usePlaceholder = computed(() => {
    const url = this.src()?.trim();
    return this.broken() || !url;
  });

  readonly displaySrc = computed(() => this.src()?.trim() ?? '');

  constructor() {
    effect(() => {
      this.src();
      this.broken.set(false);
    });
  }

  onError(): void {
    this.broken.set(true);
  }
}
