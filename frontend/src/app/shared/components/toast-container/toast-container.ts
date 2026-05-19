import { Component, inject } from '@angular/core';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  templateUrl: './toast-container.html',
  styleUrl: './toast-container.scss',
})
export class ToastContainer {
  readonly notifications = inject(NotificationService);

  dismiss(id: number): void {
    this.notifications.dismiss(id);
  }
}
