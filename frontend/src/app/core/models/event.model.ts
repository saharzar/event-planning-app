export type EventCategory = 'Conference' | 'Workshop' | 'Networking' | 'Career';

export interface EventItem {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  category: EventCategory;
  image?: string;
  month: string;
  day: string;
}
