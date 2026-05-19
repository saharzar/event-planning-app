import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ConfirmModal } from '../../components/confirm-modal/confirm-modal';

interface SidebarLink {
  label: string;
  route: string;
  icon: string;
}

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, ConfirmModal],
  templateUrl: './app-layout.html',
  styleUrl: './app-layout.scss',
})
export class AppLayout {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly currentUser = this.auth.currentUser;
  readonly sidebarOpen = signal(false);
  readonly showLogoutConfirm = signal(false);

  readonly navItems = signal<SidebarLink[]>([
    { label: 'Dashboard', route: '/dashboard', icon: 'bi-grid' },
    { label: 'Joined Events', route: '/dashboard/joined-events', icon: 'bi-heart' },
    { label: 'My Events', route: '/my-events', icon: 'bi-calendar-check' },
    { label: 'Create Event', route: '/create-event', icon: 'bi-plus-circle' },
    { label: 'Browse Events', route: '/events', icon: 'bi-calendar-week' },
  ]);

  toggleSidebar(): void {
    this.sidebarOpen.update((v) => !v);
  }

  closeSidebar(): void {
    this.sidebarOpen.set(false);
  }

  requestLogout(): void {
    this.showLogoutConfirm.set(true);
  }

  cancelLogout(): void {
    this.showLogoutConfirm.set(false);
  }

  confirmLogout(): void {
    this.showLogoutConfirm.set(false);
    this.auth.logout().subscribe({
      next: () => this.router.navigate(['/']),
    });
  }
}
