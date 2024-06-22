import { createContext, useState, useEffect, useRef, RefObject } from 'react';
import { arrayMove } from '@dnd-kit/sortable';
import type { FireworksHandlers } from '@fireworks-js/react';
import { v4 as uuid } from 'uuid';
import { ChecklistEvent, CreateEventType, EventType } from '@/types';
import { useTimer } from './utils/useTimer';
import { getItemFromLocalStorageOrDefault } from './utils';

type EventProviderType = {
  events: ChecklistEvent[];
  eventTypes: EventType[];
  fireworksRef: RefObject<FireworksHandlers & HTMLDivElement>;
  fireworksHidden: boolean;
  addEvent: (eventType: EventType, timeStampOverride?: number) => void;
  addEventType: (eventSetter: CreateEventType) => void;
  hideFireworks: () => void;
  removeEventById: (eventId: string) => void;
  removeEventType: (id: string) => void;
  reorderEventTypes: (oldIndex: number, newIndex: number) => void;
  setAllEvents: (eventTypes?: EventType[], events?: ChecklistEvent[]) => void;
  resetEvents: () => void;
};

type Props = {
  children: JSX.Element | JSX.Element[];
};

export const EventContext = createContext<EventProviderType>(
  {} as EventProviderType
);

const demoEventTypes: EventType[] = [
  {
    id: uuid(),
    type: 'counter',
    label: 'Counter',
    max: 5,
    celebrateOnCompleted: false,
  },
  {
    id: uuid(),
    type: 'completed',
    label: 'Completed',
    celebrateOnCompleted: true,
  },
];

export const EventProvider = ({ children }: Props) => {
  const { timeInMilliseconds } = useTimer();
  const fireworksRef = useRef<FireworksHandlers & HTMLDivElement>(null);
  const [fireworksHidden, setFireworksHidden] = useState(false);
  const [events, setEvents] = useState<ChecklistEvent[]>(
    getItemFromLocalStorageOrDefault('events', [])
  );

  const [eventTypes, setEventTypes] = useState<EventType[]>(
    getItemFromLocalStorageOrDefault('eventTypes', demoEventTypes)
  );

  const isEventTypeCompleted = (eventType: EventType) => {
    if (!eventType.celebrateOnCompleted) {
      return false;
    }

    const eventsCount =
      events.filter((event) => event.eventTypeId === eventType.id).length + 1;

    if (eventType.type === 'completed' && eventsCount === 1) {
      return true;
    }

    return eventsCount === eventType.max;
  };

  const addEvent = (eventType: EventType, timeStampOverride?: number) => {
    const newEvent: ChecklistEvent = {
      id: uuid(),
      eventTypeId: eventType.id,
      name: eventType.label,
      timestampInMilliseconds: timeStampOverride || timeInMilliseconds,
    };

    if (isEventTypeCompleted(eventType)) {
      fireworksRef.current?.start();
      setFireworksHidden(false);
    }

    setEvents([...events, newEvent]);
  };

  const removeEventById = (eventId: string) => {
    setEvents([...events.filter((event) => event.id !== eventId)]);
  };

  const setAllEvents = (
    eventTypes?: EventType[],
    events?: ChecklistEvent[]
  ) => {
    setEventTypes([...(eventTypes || [])]);
    setEvents([...(events || [])]);
  };

  const addEventType = (eventType: CreateEventType) => {
    if (eventType.type === 'counter' && !!eventType.max && eventType.max < 1) {
      throw new Error('Max must be greater than 0');
    }

    if (
      eventTypes.filter((event) => event.label === eventType.label).length > 0
    ) {
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

  const resetEvents = () => {
    setEvents([]);
  };

  const hideFireworks = () => {
    if (fireworksRef.current) {
      fireworksRef.current?.stop();
      fireworksRef.current?.clear();
      setFireworksHidden(true);
    }
  };

  useEffect(() => {
    localStorage.setItem('events', JSON.stringify(events));
    localStorage.setItem('eventTypes', JSON.stringify(eventTypes));
  }, [events, eventTypes]);

  useEffect(() => {
    if (fireworksRef?.current && timeInMilliseconds === 0) {
      hideFireworks();
    }
  }, [fireworksRef?.current, timeInMilliseconds]);

  const eventState = {
    events,
    eventTypes,
    fireworksRef,
    fireworksHidden,
    addEvent,
    addEventType,
    hideFireworks,
    removeEventById,
    removeEventType,
    reorderEventTypes,
    resetEvents,
    setAllEvents,
  };

  return (
    <EventContext.Provider value={eventState}>{children}</EventContext.Provider>
  );
};
