import { createContext, useContext, useState, useEffect } from 'react';
import { arrayMove } from '@dnd-kit/sortable';
import { v4 as uuid } from 'uuid';
import { ChecklistEvent, CreateEventType, EventType } from '@/types';
import { useTimer } from './TimerContext';

type EventProviderType = {
  events: ChecklistEvent[];
  eventTypes: EventType[];
  addEvent: (eventName: string, eventTypeId: string, timeStampOverride?: number) => void;
  removeEventById: (eventId: string) => void;
  addEventType: (eventSetter: CreateEventType) => void;
  removeEventType: (id: string) => void;
  reorderEventTypes: (oldIndex: number, newIndex: number) => void;
  setAllEvents: (eventTypes?: EventType[], events?: ChecklistEvent[]) => void;
};

type Props = {
  children: JSX.Element | JSX.Element[];
};

export const EventContext = createContext<EventProviderType>(
  {} as EventProviderType
);

export const EventProvider = ({ children }: Props) => {
  const [events, setEvents] = useState<ChecklistEvent[]>([]);
  const [eventTypes, setEventTypes] = useState<EventType[]>([
    {
      id: uuid(),
      type: 'counter',
      label: 'Counter',
      max: 5,
    },
    {
      id: uuid(),
      type: 'completed',
      label: 'Completed',
    },
  ]);
  const { timeInMilliseconds } = useTimer();

  const addEvent = (eventName: string, eventTypeId: string, timeStampOverride?: number) => {
    const newEvent: ChecklistEvent = {
      id: uuid(),
      eventTypeId,
      name: eventName,
      timestampInMilliseconds: timeStampOverride || timeInMilliseconds,
    };

    setEvents([...events, newEvent]);
  };

  const removeEventById = (eventId: string) => {
    setEvents([...events.filter((event) => event.id !== eventId)]);
  };

  const setAllEvents = (eventTypes?: EventType[], events?: ChecklistEvent[]) => {
    setEventTypes([...eventTypes || []]);
    setEvents([...events || []]);
  };

  const addEventType = (eventType: CreateEventType) => {
    if (eventType.type === 'counter' && !!eventType.max && eventType.max < 1) {
      throw new Error('Max must be greater than 0');
    }

    if (eventTypes.filter((event) => event.label === eventType.label).length > 0) {
      throw new Error('Event type already exists');
    }

    const newEventType: EventType = {
      ...eventType,
      id: uuid(),
    };

    setEventTypes([...eventTypes, newEventType]);
  };

  const removeEventType = (id: string) => {
    setEvents([...events.filter((event) => event.eventTypeId !== id)]);
    setEventTypes([...eventTypes.filter((eventType) => eventType.id !== id)]);
  };

  const reorderEventTypes = (oldIndex: number, newIndex: number) => {
    const sortedEvents = arrayMove(eventTypes, oldIndex, newIndex);
    setEventTypes([...sortedEvents]);
  };

  useEffect(() => {
    localStorage.setItem('events', JSON.stringify(events));
  }, [events]);

  const eventState = {
    events,
    eventTypes,
    addEvent,
    removeEventById,
    addEventType,
    removeEventType,
    reorderEventTypes,
    setAllEvents,
  };

  return (
    <EventContext.Provider value={eventState}>{children}</EventContext.Provider>
  );
};

export const useEvent = () => useContext(EventContext);
