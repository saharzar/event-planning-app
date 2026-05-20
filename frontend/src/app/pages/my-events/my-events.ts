import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { EventService } from '../../core/services/event.service';
import { NotificationService } from '../../core/services/notification.service';
import { Event, EventStatus } from '../../core/models/event-api.model';
import { getApiErrorMessage } from '../../core/utils/http-error.util';
import { LoadingState } from '../../shared/components/loading-state/loading-state';
import { EmptyState } from '../../shared/components/empty-state/empty-state';
import { StatusBadge } from '../../shared/components/status-badge/status-badge';
import { ParticipantsModal } from '../../shared/components/participants-modal/participants-modal';
import { ConfirmModal } from '../../shared/components/confirm-modal/confirm-modal';
import { CountdownBadge } from '../../shared/components/countdown-badge/countdown-badge';
import { AttendanceService } from '../../core/services/attendance.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-my-events',
  standalone: true,
  imports: [
    RouterLink,
    DatePipe,
    LoadingState,
    EmptyState,
    StatusBadge,
    ParticipantsModal,
    ConfirmModal,
    CountdownBadge,
  ],
  templateUrl: './my-events.html',
  styleUrl: './my-events.scss',
})
export class MyEvents implements OnInit {
  private readonly eventService = inject(EventService);
  private readonly attendanceService = inject(AttendanceService);
  private readonly notifications = inject(NotificationService);

  readonly loading = signal(true);
  readonly events = signal<Event[]>([]);
  readonly statusFilter = signal<EventStatus | ''>('');
  readonly participantsEvent = signal<Event | null>(null);
  readonly actionLoadingId = signal<number | null>(null);
  readonly deleteTarget = signal<{ id: number; title: string } | null>(null);
  readonly archiveTarget = signal<Event | null>(null);
  readonly attendeeCounts = signal<Record<number, number>>({});

  readonly deleteMessage = computed(() => {
    const t = this.deleteTarget();
    return t ? `Delete "${t.title}"? This cannot be undone.` : '';
  });

  readonly filteredEvents = computed(() => {
    const filter = this.statusFilter();
    const list = this.events();
    return filter ? list.filter((e) => e.status === filter) : list;
  });

  readonly statuses: (EventStatus | '')[] = ['', 'DRAFT', 'PUBLISHED', 'PAUSED', 'ARCHIVED'];

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.loading.set(true);
    this.eventService.getMyEvents().subscribe({
      next: (events) => {
        this.events.set(events);
        this.loading.set(false);
        this.loadAttendeeCounts(events);
      },
      error: (err: HttpErrorResponse) => {
        this.loading.set(false);
        this.notifications.error(getApiErrorMessage(err, 'Could not load your events.'));
      },
    });
  }

  setStatusFilter(value: string): void {
    this.statusFilter.set(value as EventStatus | '');
  }

  publish(id: number): void {
    this.runAction(id, () => this.eventService.publish(id), 'Event published.');
  }

  pause(id: number): void {
    this.runAction(id, () => this.eventService.pause(id), 'Event paused.');
  }

  requestArchive(event: Event): void {
    this.archiveTarget.set(event);
  }

  cancelArchive(): void {
    this.archiveTarget.set(null);
  }

  confirmArchive(): void {
    const target = this.archiveTarget();
    if (!target) return;
    this.archiveTarget.set(null);
    this.runAction(target.id, () => this.eventService.archive(target.id), 'Event archived.');
  }

  requestDelete(id: number, title: string): void {
    this.deleteTarget.set({ id, title });
  }

  cancelDelete(): void {
    this.deleteTarget.set(null);
  }

  confirmDelete(): void {
    const target = this.deleteTarget();
    if (!target) return;

    this.actionLoadingId.set(target.id);
    this.eventService.delete(target.id).subscribe({
      next: () => {
        this.actionLoadingId.set(null);
        this.deleteTarget.set(null);
        this.notifications.success('Event deleted.');
        this.loadEvents();
      },
      error: (err: HttpErrorResponse) => {
        this.actionLoadingId.set(null);
        this.deleteTarget.set(null);
        this.notifications.error(getApiErrorMessage(err, 'Could not delete event.'));
      },
    });
  }

  getAttendeeCount(eventId: number): number {
    return this.attendeeCounts()[eventId] ?? 0;
  }

  private loadAttendeeCounts(events: Event[]): void {
    if (events.length === 0) return;
    forkJoin(events.map((e) => this.attendanceService.getAttendeeCount(e.id))).subscribe({
      next: (counts) => {
        const map: Record<number, number> = {};
        events.forEach((e, i) => (map[e.id] = counts[i]));
        this.attendeeCounts.set(map);
      },
    });
  }

  openParticipants(event: Event): void {
    this.participantsEvent.set(event);
  }

  closeParticipants(): void {
    this.participantsEvent.set(null);
  }

  private runAction<T>(id: number, action: () => import('rxjs').Observable<T>, successMsg: string): void {
    this.actionLoadingId.set(id);
    action().subscribe({
      next: () => {
        this.actionLoadingId.set(null);
        this.notifications.success(successMsg);
        this.loadEvents();
      },
      error: (err: HttpErrorResponse) => {
        this.actionLoadingId.set(null);
        this.notifications.error(getApiErrorMessage(err, 'Action failed.'));
      },
    });
  }
}
