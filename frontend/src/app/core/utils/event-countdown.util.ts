export type CountdownVariant = 'upcoming' | 'soon' | 'today' | 'ended';

export interface EventCountdown {
  label: string;
  variant: CountdownVariant;
  daysLeft: number;
  isEnded: boolean;
}

export function getEventCountdown(dateStr: string, timeStr?: string): EventCountdown {
  const eventDate = parseEventDateTime(dateStr, timeStr);
  const now = new Date();
  const todayStart = startOfDay(now);
  const eventDayStart = startOfDay(eventDate);

  const diffMs = eventDayStart.getTime() - todayStart.getTime();
  const daysLeft = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (daysLeft < 0) {
    return { label: 'Event ended', variant: 'ended', daysLeft, isEnded: true };
  }
  if (daysLeft === 0) {
    return { label: 'Today', variant: 'today', daysLeft: 0, isEnded: false };
  }
  if (daysLeft === 1) {
    return { label: 'Tomorrow', variant: 'soon', daysLeft: 1, isEnded: false };
  }
  if (daysLeft <= 7) {
    return { label: `${daysLeft} days left`, variant: 'soon', daysLeft, isEnded: false };
  }
  return { label: `${daysLeft} days left`, variant: 'upcoming', daysLeft, isEnded: false };
}

export function isEventEnded(dateStr: string, timeStr?: string): boolean {
  return getEventCountdown(dateStr, timeStr).isEnded;
}

function parseEventDateTime(dateStr: string, timeStr?: string): Date {
  const [y, m, d] = dateStr.split('-').map(Number);
  let hours = 23;
  let minutes = 59;
  if (timeStr) {
    const parts = timeStr.split(':').map(Number);
    hours = parts[0] ?? 0;
    minutes = parts[1] ?? 0;
  }
  return new Date(y, m - 1, d, hours, minutes);
}

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}
