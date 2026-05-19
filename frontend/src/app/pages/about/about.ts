import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FadeInDirective } from '../../core/directives/fade-in.directive';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [RouterLink, FadeInDirective],
  templateUrl: './about.html',
  styleUrl: './about.scss',
})
export class About {}
