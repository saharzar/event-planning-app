import { Component, computed, input } from '@angular/core';
import { EventItem } from '../../core/models/event.model';
import { EventCover } from '../../shared/components/event-cover/event-cover';

@Component({
  selector: 'app-event-card',
  standalone: true,
  imports: [EventCover],
  templateUrl: './event-card.html',
  styleUrl: './event-card.scss',
})
export class EventCard {
  readonly event = input.required<EventItem>();

  readonly tagClass = computed(() => {
    const map: Record<string, string> = {
      Conference: 'tag-conference',
      Workshop: 'tag-workshop',
      Networking: 'tag-networking',
      Career: 'tag-career',
    };
    return map[this.event().category] ?? 'tag-conference';
  });
}
