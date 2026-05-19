import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ConfirmModal } from '../../shared/components/confirm-modal/confirm-modal';

interface NavLink {
  label: string;
  route: string;
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, ConfirmModal],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly navLinks = signal<NavLink[]>([
    { label: 'Home', route: '/' },
    { label: 'Events', route: '/events' },
    { label: 'Categories', route: '/categories' },
    { label: 'About', route: '/about' },
    { label: 'Contact', route: '/contact' },
  ]);

  readonly currentUser = this.auth.currentUser;
  readonly showLogoutConfirm = signal(false);

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
