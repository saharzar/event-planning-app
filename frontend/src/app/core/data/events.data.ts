import { EventItem } from '../models/event.model';

export const EVENTS_DATA: EventItem[] = [
  {
    id: '1',
    title: 'AI in Business Conference',
    date: 'May 24, 2026',
    time: '9:00 AM – 5:00 PM',
    location: 'Metro Convention Center',
    category: 'Conference',
    image:
      'https://images.unsplash.com/photo-1540575467064-7a2ef0a89247?auto=format&fit=crop&w=800&q=80',
    month: 'MAY',
    day: '24',
  },
  {
    id: '2',
    title: 'UX Design Workshop',
    date: 'Jun 8, 2026',
    time: '2:00 PM – 6:00 PM',
    location: 'Creative Hub Studio',
    category: 'Workshop',
    image:
      'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80',
    month: 'JUN',
    day: '08',
  },
  {
    id: '3',
    title: 'Career Networking Night',
    date: 'Jun 15, 2026',
    time: '6:30 PM – 9:30 PM',
    location: 'Downtown Business Lounge',
    category: 'Networking',
    month: 'JUN',
    day: '15',
  },
  {
    id: '4',
    title: 'University Tech Summit',
    date: 'Jul 2, 2026',
    time: '10:00 AM – 4:00 PM',
    location: 'State University Auditorium',
    category: 'Career',
    month: 'JUL',
    day: '02',
  },
];
