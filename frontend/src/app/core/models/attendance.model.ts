import { Event } from './event-api.model';
import { User } from './user.model';

export interface Attendance {
  id: number;
  user: User;
  event: Event;
  joinedAt: string;
}
