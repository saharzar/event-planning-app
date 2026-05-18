import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {
  readonly currentYear = new Date().getFullYear();

  readonly quickLinks = signal([
    { label: 'Home', href: '#home' },
    { label: 'Events', href: '#events' },
    { label: 'Categories', href: '#categories' },
    { label: 'About', href: '#about' },
  ]);

  readonly supportLinks = signal([
    { label: 'Help Center', href: '#' },
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' },
    { label: 'Contact', href: '#contact' },
  ]);

  readonly socialLinks = signal([
    { icon: 'bi-facebook', href: '#', label: 'Facebook' },
    { icon: 'bi-twitter-x', href: '#', label: 'Twitter' },
    { icon: 'bi-linkedin', href: '#', label: 'LinkedIn' },
    { icon: 'bi-instagram', href: '#', label: 'Instagram' },
  ]);
}
