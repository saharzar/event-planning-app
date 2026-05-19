const CATEGORY_IMAGES: Record<string, string> = {
  Conference:
    'https://images.unsplash.com/photo-1540575467064-7a2ef0a89247?auto=format&fit=crop&w=1200&q=80',
  Workshop:
    'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1200&q=80',
  Networking:
    'https://images.unsplash.com/photo-1515187024625-ed09d4fadb0e?auto=format&fit=crop&w=1200&q=80',
  Career:
    'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
  Social:
    'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80',
  University:
    'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80',
  Business:
    'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=80',
  Other:
    'https://images.unsplash.com/photo-1475721027905-f990489f5c4f?auto=format&fit=crop&w=1200&q=80',
};

const DEFAULT_IMAGE =
  'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80';

export function getEventImage(category: string, eventId?: number): string {
  const base = CATEGORY_IMAGES[category] ?? DEFAULT_IMAGE;
  if (eventId === undefined) return base;
  return `${base}&sig=${eventId}`;
}
