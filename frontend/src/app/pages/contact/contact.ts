import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NotificationService } from '../../core/services/notification.service';
import { FadeInDirective } from '../../core/directives/fade-in.directive';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ReactiveFormsModule, FadeInDirective],
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
})
export class Contact {
  private readonly fb = inject(FormBuilder);
  private readonly notifications = inject(NotificationService);

  readonly submitted = signal(false);

  readonly form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    subject: ['', Validators.required],
    message: ['', [Validators.required, Validators.minLength(10)]],
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { name, email, subject, message } = this.form.value;
    const mailto = `mailto:saharzar77@gmail.com?subject=${encodeURIComponent(`[Evently] ${subject}`)}&body=${encodeURIComponent(`From: ${name}\nEmail: ${email}\n\n${message}`)}`;
    window.open(mailto, '_blank');
    this.submitted.set(true);
    this.notifications.success('Thanks! We received your message and will get back to you soon.');
    this.form.reset();
  }
}
