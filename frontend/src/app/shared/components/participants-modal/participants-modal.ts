import { Component, inject, input, output, signal, effect } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ParticipationService } from '../../../core/services/participation.service';
import { Participation } from '../../../core/models/participation.model';
import { NotificationService } from '../../../core/services/notification.service';
import { getApiErrorMessage } from '../../../core/utils/http-error.util';
import { HttpErrorResponse } from '@angular/common/http';
import { LoadingState } from '../loading-state/loading-state';
import { EmptyState } from '../empty-state/empty-state';

@Component({
  selector: 'app-participants-modal',
  standalone: true,
  imports: [DatePipe, LoadingState, EmptyState],
  templateUrl: './participants-modal.html',
  styleUrl: './participants-modal.scss',
})
export class ParticipantsModal {
  private readonly participationService = inject(ParticipationService);
  private readonly notifications = inject(NotificationService);

  readonly eventId = input.required<number>();
  readonly eventTitle = input.required<string>();
  readonly closed = output<void>();

  readonly loading = signal(false);
  readonly participants = signal<Participation[]>([]);

  constructor() {
    effect(() => {
      const id = this.eventId();
      if (id) {
        this.loadParticipants(id);
      }
    });
  }

  loadParticipants(eventId: number): void {
    this.loading.set(true);
    this.participationService.getParticipants(eventId).subscribe({
      next: (list) => {
        this.participants.set(list);
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.loading.set(false);
        this.notifications.error(getApiErrorMessage(err, 'Could not load participants.'));
        this.close();
      },
    });
  }

  close(): void {
    this.closed.emit();
  }
}
