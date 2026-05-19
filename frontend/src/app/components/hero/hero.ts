import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './hero.html',
  styleUrl: './hero.scss',
})
export class Hero {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly avatars = signal<string[]>([
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&h=80&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&h=80&q=80',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=80&h=80&q=80',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=80&h=80&q=80',
  ]);

  readonly upcomingPreview = signal([
    { title: 'Design Systems Meetup', time: 'Today, 6 PM', color: '#7c3aed' },
    { title: 'Startup Pitch Night', time: 'Fri, 7:30 PM', color: '#3b82f6' },
    { title: 'Wellness Workshop', time: 'Sat, 10 AM', color: '#059669' },
  ]);

  createEvent(): void {
    if (this.auth.isLoggedIn()) {
      this.router.navigate(['/create-event']);
      return;
    }
    this.router.navigate(['/login'], { queryParams: { returnUrl: '/create-event' } });
  }
}
