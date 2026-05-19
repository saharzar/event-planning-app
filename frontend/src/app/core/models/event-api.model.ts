import { User } from './user.model';

export type EventStatus = 'DRAFT' | 'PUBLISHED' | 'PAUSED' | 'ARCHIVED';

export interface Event {
  id: number;
  title: string;
  description: string;
  location: string;
  category: string;
  date: string;
  time: string;
  status: EventStatus;
  imageUrl?: string | null;
  organizer: User;
}

export interface EventRequest {
  title: string;
  description: string;
  location: string;
  category: string;
  date: string;
  time: string;
  imageUrl?: string | null;
}

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export const EVENT_CATEGORIES = [
  'Conference',
  'Workshop',
  'Networking',
  'Career',
  'Social',
  'University',
  'Business',
  'Other',
] as const;

export const EVENT_STATUSES: EventStatus[] = ['DRAFT', 'PUBLISHED', 'PAUSED', 'ARCHIVED'];
