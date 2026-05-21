import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { EventService } from '../../core/services/event.service';
import { ParticipationService } from '../../core/services/participation.service';
import { Event, EventStatus } from '../../core/models/event-api.model';
import { Participation } from '../../core/models/participation.model';
import { isEventEnded } from '../../core/utils/event-countdown.util';
import { isActiveJoinedEventStatus } from '../../core/utils/joined-events.util';
import { LoadingState } from '../../shared/components/loading-state/loading-state';
import { EmptyState } from '../../shared/components/empty-state/empty-state';
import { StatusBadge } from '../../shared/components/status-badge/status-badge';
import { CountdownBadge } from '../../shared/components/countdown-badge/countdown-badge';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    RouterLink,
    LoadingState,
    EmptyState,
    StatusBadge,
    CountdownBadge,
    DatePipe,
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly eventService = inject(EventService);
  private readonly participationService = inject(ParticipationService);

  readonly currentUser = this.auth.currentUser;
  readonly loading = signal(true);
  readonly myEvents = signal<Event[]>([]);
  readonly joinedParticipations = signal<Participation[]>([]);
  readonly publishedBrowse = signal<Event[]>([]);

  readonly stats = computed(() => {
    const created = this.myEvents();
    const joined = this.joinedParticipations();
    const countBy = (status: EventStatus) => created.filter((e) => e.status === status).length;
    const upcomingJoined = joined.length;
    const upcomingCreated = created.filter(
      (e) => e.status === 'PUBLISHED' && !isEventEnded(e.date, e.time)
    ).length;

    return {
      totalCreated: created.length,
      published: countBy('PUBLISHED'),
      draft: countBy('DRAFT'),
      joined: joined.length,
      upcoming: upcomingJoined + upcomingCreated,
    };
  });

  readonly recentCreated = computed(() =>
    [...this.myEvents()]
      .sort((a, b) => (a.date < b.date ? 1 : -1))
      .slice(0, 4)
  );

  readonly recentJoined = computed(() =>
    [...this.joinedParticipations()]
      .sort((a, b) => (a.event.date < b.event.date ? 1 : -1))
      .slice(0, 4)
  );

  ngOnInit(): void {
    forkJoin({
      mine: this.eventService.getMyEvents(),
      joined: this.participationService.getMyUpcomingJoined(),
      browse: this.eventService.getPublished({ page: 0, size: 4, sort: 'date,desc' }),
    }).subscribe({
      next: ({ mine, joined, browse }) => {
        this.myEvents.set(mine);
        this.joinedParticipations.set(joined);
        this.publishedBrowse.set(browse.content);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}
