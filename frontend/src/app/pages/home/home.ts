import { Component, signal } from '@angular/core';
import { Navbar } from '../../components/navbar/navbar';
import { Hero } from '../../components/hero/hero';
import { FeatureCard } from '../../components/feature-card/feature-card';
import { Stats } from '../../components/stats/stats';
import { EventCard } from '../../components/event-card/event-card';
import { CtaBanner } from '../../components/cta-banner/cta-banner';
import { Footer } from '../../components/footer/footer';
import { FadeInDirective } from '../../core/directives/fade-in.directive';
import { FEATURES_DATA } from '../../core/data/features.data';
import { EVENTS_DATA } from '../../core/data/events.data';
import { STATS_DATA } from '../../core/data/stats.data';
import { Feature } from '../../core/models/feature.model';
import { EventItem } from '../../core/models/event.model';
import { StatItem } from '../../core/models/stat.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    Navbar,
    Hero,
    FeatureCard,
    Stats,
    EventCard,
    CtaBanner,
    Footer,
    FadeInDirective,
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  readonly features = signal<Feature[]>(FEATURES_DATA);
  readonly events = signal<EventItem[]>(EVENTS_DATA);
  readonly stats = signal<StatItem[]>(STATS_DATA);
}
