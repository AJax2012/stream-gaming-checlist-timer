import CreateEventType from './CreateEventType';

type EventType = {
  id: string;
  order: number;
} & Omit<CreateEventType, 'order'>;

export default EventType;
