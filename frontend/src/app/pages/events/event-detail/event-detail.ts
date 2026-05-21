import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { forkJoin, of } from 'rxjs';
import { EventService } from '../../../core/services/event.service';
import { ParticipationService } from '../../../core/services/participation.service';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Event } from '../../../core/models/event-api.model';
import { Participation } from '../../../core/models/participation.model';
import { getApiErrorMessage } from '../../../core/utils/http-error.util';
import { LoadingState } from '../../../shared/components/loading-state/loading-state';
import { StatusBadge } from '../../../shared/components/status-badge/status-badge';
import { CountdownBadge } from '../../../shared/components/countdown-badge/countdown-badge';
import { EventCover } from '../../../shared/components/event-cover/event-cover';
import { isActiveJoinedEventStatus } from '../../../core/utils/joined-events.util';

@Component({
  selector: 'app-event-detail',
  standalone: true,
  imports: [RouterLink, DatePipe, LoadingState, StatusBadge, CountdownBadge, EventCover],
  templateUrl: './event-detail.html',
  styleUrl: './event-detail.scss',
})
export class EventDetail implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly eventService = inject(EventService);
  private readonly participationService = inject(ParticipationService);
  private readonly auth = inject(AuthService);
  private readonly notifications = inject(NotificationService);

  readonly loading = signal(true);
  readonly joining = signal(false);
  readonly leaving = signal(false);
  readonly event = signal<Event | null>(null);
  readonly participantCount = signal(0);
  readonly hasJoined = signal(false);
  readonly participants = signal<Participation[]>([]);
  readonly showAttendeesList = signal(false);

  readonly currentUser = this.auth.currentUser;
  readonly isLoggedIn = computed(() => this.auth.isLoggedIn());

  readonly isOwner = computed(() => {
    const user = this.currentUser();
    const ev = this.event();
    return user && ev ? ev.organizer.id === user.id : false;
  });

  readonly canJoin = computed(() => {
    const ev = this.event();
    return (
      this.isLoggedIn() &&
      ev?.status === 'PUBLISHED' &&
      !this.isOwner() &&
      !this.hasJoined()
    );
  });

  readonly canLeave = computed(() => {
    const ev = this.event();
    return this.hasJoined() && !!ev && isActiveJoinedEventStatus(ev.status);
  });

  readonly isInactiveParticipation = computed(() => {
    const ev = this.event();
    return this.hasJoined() && !!ev && !isActiveJoinedEventStatus(ev.status);
  });

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id || Number.isNaN(id)) {
      this.router.navigate(['/events']);
      return;
    }
    this.loadEvent(id);
  }

  loadEvent(id: number): void {
    this.loading.set(true);
    const joined$ = this.auth.isLoggedIn()
      ? this.participationService.hasJoined(id)
      : of(false);

    forkJoin({
      event: this.eventService.getById(id),
      count: this.participationService.getAttendeeCount(id),
      joined: joined$,
    }).subscribe({
      next: ({ event, count, joined }) => {
        this.event.set(event);
        this.participantCount.set(count);
        this.hasJoined.set(joined);
        this.loading.set(false);
        if (this.isOwner()) {
          this.loadParticipants(id);
        }
      },
      error: (err: HttpErrorResponse) => {
        this.loading.set(false);
        this.notifications.error(getApiErrorMessage(err, 'Event not found.'));
        this.router.navigate(['/events']);
      },
    });
  }

  loadParticipants(eventId: number): void {
    this.participationService.getParticipants(eventId).subscribe({
      next: (list) => {
        this.participants.set(list);
        this.participantCount.set(list.length);
      },
      error: () => this.participants.set([]),
    });
  }

  toggleAttendees(): void {
    this.showAttendeesList.update((v) => !v);
  }

  joinEvent(): void {
    const ev = this.event();
    if (!ev) return;

    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: `/events/${ev.id}` } });
      return;
    }

    this.joining.set(true);
    this.participationService.join(ev.id).subscribe({
      next: () => {
        this.joining.set(false);
        this.hasJoined.set(true);
        this.participantCount.update((c) => c + 1);
        this.notifications.success('You have joined this event!');
      },
      error: (err: HttpErrorResponse) => {
        this.joining.set(false);
        this.notifications.error(getApiErrorMessage(err, 'Could not join event.'));
      },
    });
  }

  onGalleryError(evt: Event | any): void {
    const el = (evt?.currentTarget || evt?.target) as HTMLElement;
    if (el) el.style.display = 'none';
  }

  leaveEvent(): void {
    const ev = this.event();
    if (!ev) return;

    this.leaving.set(true);
    this.participationService.leave(ev.id).subscribe({
      next: () => {
        this.leaving.set(false);
        this.hasJoined.set(false);
        this.participantCount.update((c) => Math.max(0, c - 1));
        this.notifications.success('You have left this event.');
      },
      error: (err: HttpErrorResponse) => {
        this.leaving.set(false);
        this.notifications.error(getApiErrorMessage(err, 'Could not leave event.'));
      },
    });
  }
}
