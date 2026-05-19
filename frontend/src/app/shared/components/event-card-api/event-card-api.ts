import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { Event } from '../../../core/models/event-api.model';
import { StatusBadge } from '../status-badge/status-badge';
import { CountdownBadge } from '../countdown-badge/countdown-badge';
import { EventCover } from '../event-cover/event-cover';

@Component({
  selector: 'app-event-card-api',
  standalone: true,
  imports: [RouterLink, DatePipe, StatusBadge, CountdownBadge, EventCover],
  templateUrl: './event-card-api.html',
  styleUrl: './event-card-api.scss',
})
export class EventCardApi {
  readonly event = input.required<Event>();
  readonly attendeeCount = input<number | null>(null);
  readonly showLeave = input(false);

  readonly leave = output<number>();

  coverSrc(): string | null {
    const url = this.event().imageUrl?.trim();
    return url || null;
  }

  onLeave(): void {
    this.leave.emit(this.event().id);
  }
}
