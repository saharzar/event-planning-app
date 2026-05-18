import { Feature } from '../models/feature.model';

export const FEATURES_DATA: Feature[] = [
  {
    id: '1',
    title: 'Create Events',
    description: 'Launch professional events in minutes with intuitive tools and beautiful templates.',
    icon: 'bi-calendar-plus',
    iconClass: 'icon-blue',
  },
  {
    id: '2',
    title: 'Manage Participants',
    description: 'Track registrations, send updates, and keep your audience engaged effortlessly.',
    icon: 'bi-people',
    iconClass: 'icon-purple',
  },
  {
    id: '3',
    title: 'Discover Opportunities',
    description: 'Find conferences, workshops, and networking events tailored to your interests.',
    icon: 'bi-compass',
    iconClass: 'icon-green',
  },
  {
    id: '4',
    title: 'Smart Scheduling',
    description: 'Avoid conflicts with intelligent calendar sync and automated reminders.',
    icon: 'bi-clock-history',
    iconClass: 'icon-orange',
  },
];
