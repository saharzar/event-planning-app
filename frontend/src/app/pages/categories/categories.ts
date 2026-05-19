import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EVENT_CATEGORIES } from '../../core/models/event-api.model';
import { FadeInDirective } from '../../core/directives/fade-in.directive';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [RouterLink, FadeInDirective],
  templateUrl: './categories.html',
  styleUrl: './categories.scss',
})
export class Categories {
  readonly categories = EVENT_CATEGORIES.map((name) => ({
    name,
    icon: this.iconFor(name),
    description: this.descriptionFor(name),
  }));

  private iconFor(name: string): string {
    const map: Record<string, string> = {
      Conference: 'bi-mic',
      Workshop: 'bi-tools',
      Networking: 'bi-people',
      Career: 'bi-briefcase',
      Social: 'bi-heart',
      University: 'bi-mortarboard',
      Business: 'bi-building',
      Other: 'bi-stars',
    };
    return map[name] ?? 'bi-calendar-event';
  }

  private descriptionFor(name: string): string {
    const map: Record<string, string> = {
      Conference: 'Talks, keynotes, and industry insights at scale.',
      Workshop: 'Hands-on sessions to learn skills in small groups.',
      Networking: 'Meet professionals and grow your circle.',
      Career: 'Job fairs, mentorship, and career development.',
      Social: 'Community gatherings and casual meetups.',
      University: 'Campus events, clubs, and student life.',
      Business: 'Corporate meetings, summits, and B2B events.',
      Other: 'Unique experiences that don’t fit a single box.',
    };
    return map[name] ?? 'Discover events in this category.';
  }
}
