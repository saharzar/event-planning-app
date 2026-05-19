import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject, switchMap } from 'rxjs';
import { EventService } from '../../../core/services/event.service';
import { AttendanceService } from '../../../core/services/attendance.service';
import { Event } from '../../../core/models/event-api.model';
import { EVENT_CATEGORIES } from '../../../core/models/event-api.model';
import { isEventEnded } from '../../../core/utils/event-countdown.util';
import { LoadingState } from '../../../shared/components/loading-state/loading-state';
import { EmptyState } from '../../../shared/components/empty-state/empty-state';
import { EventCardApi } from '../../../shared/components/event-card-api/event-card-api';
import { FadeInDirective } from '../../../core/directives/fade-in.directive';
import { forkJoin } from 'rxjs';

type TimeFilter = 'all' | 'upcoming' | 'past';

@Component({
  selector: 'app-events-list',
  standalone: true,
  imports: [FormsModule, LoadingState, EmptyState, EventCardApi, FadeInDirective],
  templateUrl: './events-list.html',
  styleUrl: './events-list.scss',
})
export class EventsList implements OnInit {
  private readonly eventService = inject(EventService);
  private readonly attendanceService = inject(AttendanceService);
  private readonly route = inject(ActivatedRoute);
  private readonly search$ = new Subject<string>();

  readonly categories = EVENT_CATEGORIES;
  readonly loading = signal(false);
  readonly events = signal<Event[]>([]);
  readonly attendeeCounts = signal<Record<number, number>>({});
  readonly searchQuery = signal('');
  readonly categoryFilter = signal('');
  readonly timeFilter = signal<TimeFilter>('upcoming');
  readonly page = signal(0);
  readonly totalPages = signal(0);
  readonly totalElements = signal(0);
  readonly pageSize = 9;

  readonly pageNumbers = computed(() =>
    Array.from({ length: this.totalPages() }, (_, index) => index)
  );

  readonly filteredEvents = computed(() => {
    const list = this.events();
    const time = this.timeFilter();
    if (time === 'all') return list;
    if (time === 'upcoming') {
      return list.filter((e) => !isEventEnded(e.date, e.time));
    }
    return list.filter((e) => isEventEnded(e.date, e.time));
  });

  ngOnInit(): void {
    const category = this.route.snapshot.queryParamMap.get('category');
    if (category) {
      this.categoryFilter.set(category);
    }

    this.loadEvents();
    this.search$
      .pipe(
        debounceTime(350),
        distinctUntilChanged(),
        switchMap((q) => {
          this.page.set(0);
          return this.fetchPage(q, 0);
        })
      )
      .subscribe((page) => this.applyPage(page));
  }

  onSearchInput(value: string): void {
    this.searchQuery.set(value);
    this.search$.next(value.trim());
  }

  onCategoryChange(value: string): void {
    this.categoryFilter.set(value);
    this.page.set(0);
    this.loadEvents();
  }

  onTimeFilterChange(value: TimeFilter): void {
    this.timeFilter.set(value);
  }

  loadEvents(): void {
    this.loading.set(true);
    this.fetchPage(this.searchQuery().trim(), this.page()).subscribe({
      next: (page) => {
        this.applyPage(page);
        this.loadAttendeeCounts(page.content);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  goToPage(page: number): void {
    if (page < 0 || page >= this.totalPages()) return;
    this.page.set(page);
    this.loadEvents();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  private loadAttendeeCounts(events: Event[]): void {
    if (events.length === 0) return;
    const requests = events.map((e) => this.attendanceService.getAttendeeCount(e.id));
    forkJoin(requests).subscribe({
      next: (counts) => {
        const map: Record<number, number> = {};
        events.forEach((e, i) => {
          map[e.id] = counts[i];
        });
        this.attendeeCounts.set(map);
      },
    });
  }

  getAttendeeCount(eventId: number): number | null {
    const map = this.attendeeCounts();
    return map[eventId] ?? null;
  }

  private fetchPage(query: string, page: number) {
    const params = { page, size: this.pageSize, sort: 'date,asc' };
    if (query) {
      return this.eventService.search(query, params);
    }
    return this.eventService.getPublished(params);
  }

  private applyPage(page: {
    content: Event[];
    totalPages: number;
    totalElements: number;
  }): void {
    let content = page.content;
    const cat = this.categoryFilter();
    if (cat) {
      content = content.filter((e) => e.category === cat);
    }
    this.events.set(content);
    this.totalPages.set(page.totalPages);
    this.totalElements.set(page.totalElements);
  }
}
