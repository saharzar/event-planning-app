import { Component, input } from '@angular/core';
import { StatItem } from '../../core/models/stat.model';
import { FadeInDirective } from '../../core/directives/fade-in.directive';

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [FadeInDirective],
  templateUrl: './stats.html',
  styleUrl: './stats.scss',
})
export class Stats {
  readonly items = input.required<StatItem[]>();
}
