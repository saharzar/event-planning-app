import { User } from './user.model';
import { Event } from './event-api.model';

export interface Participation {
  id: number;
  user: User;
  event: Event;
  joinedAt: string;
}
