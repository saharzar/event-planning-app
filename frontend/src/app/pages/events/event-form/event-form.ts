import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { finalize } from 'rxjs';
import { EventService } from '../../../core/services/event.service';
import { NotificationService } from '../../../core/services/notification.service';
import { EVENT_CATEGORIES } from '../../../core/models/event-api.model';
import { getApiErrorMessage } from '../../../core/utils/http-error.util';
import { LoadingState } from '../../../shared/components/loading-state/loading-state';
import { EventCover } from '../../../shared/components/event-cover/event-cover';

@Component({
  selector: 'app-event-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, LoadingState, EventCover],
  templateUrl: './event-form.html',
  styleUrl: './event-form.scss',
})
export class EventForm implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly eventService = inject(EventService);
  private readonly notifications = inject(NotificationService);

  readonly categories = EVENT_CATEGORIES;
  readonly loading = signal(false);
  readonly submitting = signal(false);
  readonly isEditMode = signal(false);
  readonly imagePreview = signal<string | null>(null);
  private eventId: number | null = null;

  readonly form = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.maxLength(120)]],
    description: [''],
    location: ['', Validators.required],
    category: ['Conference', Validators.required],
    date: ['', Validators.required],
    time: ['', Validators.required],
    imageUrl: [''],
  });

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode.set(true);
      this.eventId = Number(idParam);
      this.loadEvent(this.eventId);
    }
  }

  loadEvent(id: number): void {
    this.loading.set(true);
    this.eventService.getById(id).subscribe({
      next: (event) => {
        this.form.patchValue({
          title: event.title,
          description: event.description ?? '',
          location: event.location,
          category: event.category,
          date: event.date,
          time: event.time?.slice(0, 5) ?? event.time,
          imageUrl: event.imageUrl ?? '',
        });
        this.imagePreview.set(event.imageUrl?.trim() || null);
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.loading.set(false);
        this.notifications.error(getApiErrorMessage(err, 'Could not load event.'));
        this.router.navigate(['/dashboard']);
      },
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.getRawValue();
    const payload = {
      ...raw,
      time: this.normalizeTime(raw.time),
      imageUrl: raw.imageUrl?.trim() || null,
    };

    this.submitting.set(true);
    const request$ =
      this.isEditMode() && this.eventId
        ? this.eventService.update(this.eventId, payload)
        : this.eventService.create(payload);

    request$.pipe(finalize(() => this.submitting.set(false))).subscribe({
      next: (event) => {
        this.notifications.success(
          this.isEditMode() ? 'Event updated successfully.' : 'Event created as draft.'
        );
        this.router.navigate(['/dashboard']);
      },
      error: (err: HttpErrorResponse) =>
        this.notifications.error(getApiErrorMessage(err, 'Could not save event.')),
    });
  }

  onImageFileChange(event: globalThis.Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) {
      return;
    }
    if (!file.type.startsWith('image/')) {
      this.notifications.error('Please choose an image file.');
      input.value = '';
      return;
    }
    if (file.size > 800_000) {
      this.notifications.error('Image must be 800 KB or smaller.');
      input.value = '';
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      this.imagePreview.set(dataUrl);
      this.form.patchValue({ imageUrl: dataUrl });
    };
    reader.readAsDataURL(file);
  }

  clearImage(): void {
    this.imagePreview.set(null);
    this.form.patchValue({ imageUrl: '' });
  }

  private normalizeTime(time: string): string {
    return time.length === 5 ? `${time}:00` : time;
  }
}
