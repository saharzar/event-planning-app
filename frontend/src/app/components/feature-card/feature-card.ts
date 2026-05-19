import { Component, input } from '@angular/core';
import { Feature } from '../../core/models/feature.model';

@Component({
  selector: 'app-feature-card',
  standalone: true,
  templateUrl: './feature-card.html',
  styleUrl: './feature-card.scss',
})
export class FeatureCard {
  readonly feature = input.required<Feature>();
}
