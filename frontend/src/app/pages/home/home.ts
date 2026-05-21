import { Component, signal } from '@angular/core';
import { Hero } from '../../components/hero/hero';
import { FeatureCard } from '../../components/feature-card/feature-card';
import { Stats } from '../../components/stats/stats';
import { CtaBanner } from '../../components/cta-banner/cta-banner';
import { FadeInDirective } from '../../core/directives/fade-in.directive';
import { FEATURES_DATA } from '../../core/data/features.data';
import { STATS_DATA } from '../../core/data/stats.data';
import { Feature } from '../../core/models/feature.model';
import { StatItem } from '../../core/models/stat.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    Hero,
    FeatureCard,
    Stats,
    CtaBanner,
    FadeInDirective,
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  readonly features = signal<Feature[]>(FEATURES_DATA);
  readonly stats = signal<StatItem[]>(STATS_DATA);
}
