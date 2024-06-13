import { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuid } from 'uuid';
import { ChecklistEvent, CreateEventType, EventType } from '@/types';
import { useTimer } from './TimerContext';

type EventProviderType = {
  events: ChecklistEvent[];
  eventTypes: EventType[];
  addEvent: (eventName: string) => void;
  removeEvent: (eventName: string) => void;
  removeEventById: (eventId: string) => void;
  addEventType: (eventSetter: CreateEventType) => void;
  removeEventType: (id: string) => void;
  clearEvents: () => void;
};

type Props = {
  children: JSX.Element | JSX.Element[];
};

export const EventContext = createContext<EventProviderType>({} as EventProviderType);

export const EventProvider = ({ children }: Props) => {
  const [events, setEvents] = useState<ChecklistEvent[]>([]);
  const [eventTypes, setEventTypes] = useState<EventType[]>([
    {
      id: uuid(),
      order: 1,
      type: 'counter',
      label: 'Counter',
      max: 5,
    },
    {
      id: uuid(),
      order: 2,
      type: 'completed',
      label: 'Completed',
    },]);
  const { timeInMilliseconds } = useTimer();

  const addEvent = (eventName: string) => {
    const newEvent: ChecklistEvent = {
      id: uuid(),
      name: eventName,
      timestampInMilliseconds: timeInMilliseconds,
    };

    setEvents([...events, newEvent]);
  };

  const removeEvent = (name: string) => {
    const newEvent = events.filter((event) => event.name === name).pop();

    if (newEvent) {
      setEvents([...events.filter((event) => event.id !== newEvent.id)]);
    }
  };

  const removeEventById = (eventId: string) => {
    setEvents([...events.filter((event) => event.id !== eventId)]);
  };

  const clearEvents = () => {
    setEvents([]);
  };

  const addEventType = (eventType: CreateEventType) => {
    if (eventType.type === 'counter' && !!eventType.max && eventType.max < 1) {
      throw new Error('Max must be greater than 0');
    }

    const newEventType: EventType = {
      id: uuid(),
      order: eventTypes.length + 1,
      ...eventType,
    };

    setEventTypes([...eventTypes, newEventType]);
  };

  const removeEventType = (id: string) => {
    setEventTypes([...eventTypes.filter((eventType) => eventType.id !== id)]);
  };

  useEffect(() => {
    localStorage.setItem('events', JSON.stringify(events));
  }, [events]);



  const eventState = {
    events,
    eventTypes,
    addEvent,
    removeEvent,
    removeEventById,
    addEventType,
    removeEventType,
    clearEvents,
  };


  return (
    <EventContext.Provider value={eventState}>{children}</EventContext.Provider>
  );
};

export const useEvent = () => useContext(EventContext);
