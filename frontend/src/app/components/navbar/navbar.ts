import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

interface NavLink {
  label: string;
  href: string;
  active?: boolean;
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly navLinks = signal<NavLink[]>([
    { label: 'Home', href: '/#home', active: true },
    { label: 'Events', href: '/#events' },
    { label: 'Categories', href: '/#categories' },
    { label: 'About', href: '/#about' },
    { label: 'Contact', href: '/#contact' },
  ]);

  readonly currentUser = this.auth.currentUser;

  logout(): void {
    this.auth.logout().subscribe({
      next: () => this.router.navigate(['/']),
    });
  }
}
