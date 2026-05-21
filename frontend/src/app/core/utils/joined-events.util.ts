import { EventStatus } from '../models/event-api.model';

/** Events users actively participate in (shown on Joined Events & dashboard). */
export function isActiveJoinedEventStatus(status: EventStatus): boolean {
  return status !== 'ARCHIVED' && status !== 'SUSPENDED';
}
