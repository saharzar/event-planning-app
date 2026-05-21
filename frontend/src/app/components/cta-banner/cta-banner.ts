import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FadeInDirective } from '../../core/directives/fade-in.directive';

@Component({
  selector: 'app-cta-banner',
  standalone: true,
  imports: [RouterLink, FadeInDirective],
  templateUrl: './cta-banner.html',
  styleUrl: './cta-banner.scss',
})
export class CtaBanner {}
