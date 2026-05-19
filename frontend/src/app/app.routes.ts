import { Routes } from '@angular/router';
import { MarketingLayout } from './shared/layout/marketing-layout/marketing-layout';
import { AppLayout } from './shared/layout/app-layout/app-layout';
import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';

export const routes: Routes = [
  {
    path: '',
    component: MarketingLayout,
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/home/home').then((m) => m.Home),
      },
      {
        path: 'categories',
        loadComponent: () =>
          import('./pages/categories/categories').then((m) => m.Categories),
      },
      {
        path: 'about',
        loadComponent: () => import('./pages/about/about').then((m) => m.About),
      },
      {
        path: 'contact',
        loadComponent: () => import('./pages/contact/contact').then((m) => m.Contact),
      },
      {
        path: 'events',
        loadComponent: () =>
          import('./pages/events/events-list/events-list').then((m) => m.EventsList),
      },
    ],
  },
  {
    path: 'events/:id',
    component: MarketingLayout,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/events/event-detail/event-detail').then((m) => m.EventDetail),
      },
    ],
  },
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () => import('./pages/login/login').then((m) => m.Login),
  },
  {
    path: 'signup',
    canActivate: [guestGuard],
    loadComponent: () => import('./pages/signup/signup').then((m) => m.Signup),
  },
  {
    path: '',
    component: AppLayout,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/dashboard/dashboard').then((m) => m.Dashboard),
      },
      {
        path: 'dashboard/joined-events',
        loadComponent: () =>
          import('./pages/joined-events/joined-events').then((m) => m.JoinedEvents),
      },
      {
        path: 'my-events',
        loadComponent: () => import('./pages/my-events/my-events').then((m) => m.MyEvents),
      },
      {
        path: 'create-event',
        loadComponent: () =>
          import('./pages/events/event-form/event-form').then((m) => m.EventForm),
      },
      {
        path: 'events/:id/edit',
        loadComponent: () =>
          import('./pages/events/event-form/event-form').then((m) => m.EventForm),
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
