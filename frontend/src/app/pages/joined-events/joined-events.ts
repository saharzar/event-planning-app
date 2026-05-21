import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ParticipationService } from '../../core/services/participation.service';
import { NotificationService } from '../../core/services/notification.service';
import { Event } from '../../core/models/event-api.model';
import { Participation } from '../../core/models/participation.model';
import { getApiErrorMessage } from '../../core/utils/http-error.util';
import { LoadingState } from '../../shared/components/loading-state/loading-state';
import { EmptyState } from '../../shared/components/empty-state/empty-state';
import { EventCardApi } from '../../shared/components/event-card-api/event-card-api';
import { ConfirmModal } from '../../shared/components/confirm-modal/confirm-modal';

@Component({
  selector: 'app-joined-events',
  standalone: true,
  imports: [RouterLink, LoadingState, EmptyState, EventCardApi, ConfirmModal],
  templateUrl: './joined-events.html',
  styleUrl: './joined-events.scss',
})
export class JoinedEvents implements OnInit {
  private readonly participationService = inject(ParticipationService);
  private readonly notifications = inject(NotificationService);

  readonly loading = signal(true);
  readonly participations = signal<Participation[]>([]);
  readonly leaveTargetId = signal<number | null>(null);

  readonly events = signal<Event[]>([]);

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.participationService.getMyUpcomingJoined().subscribe({
      next: (list) => {
        this.participations.set(list);
        this.events.set(list.map((a) => a.event));
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.loading.set(false);
        this.notifications.error(getApiErrorMessage(err, 'Could not load joined events.'));
      },
    });
  }

  requestLeave(eventId: number): void {
    this.leaveTargetId.set(eventId);
  }

  cancelLeave(): void {
    this.leaveTargetId.set(null);
  }

  confirmLeave(): void {
    const id = this.leaveTargetId();
    if (id === null) return;

    this.participationService.leave(id).subscribe({
      next: () => {
        this.leaveTargetId.set(null);
        this.notifications.success('You have left the event.');
        this.load();
      },
      error: (err: HttpErrorResponse) => {
        this.leaveTargetId.set(null);
        this.notifications.error(getApiErrorMessage(err, 'Could not leave event.'));
      },
    });
  }
}
