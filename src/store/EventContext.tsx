import { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuid } from 'uuid';
import { ChecklistEvent } from '@/types';
import { useTimer } from './TimerContext';

type EventProviderType = {
  events: ChecklistEvent[];
  addEvent: (eventName: string) => void;
  removeEvent: (eventName: string) => void;
  removeEventById: (eventId: string) => void;
  clearEvents: () => void;
};

type Props = {
  children: JSX.Element | JSX.Element[];
};

export const EventContext = createContext<EventProviderType>({
  events: [],
  addEvent: () => { },
  removeEvent: () => { },
  removeEventById: () => { },
  clearEvents: () => { },
});

export const EventProvider = ({ children }: Props) => {
  const [events, setEvents] = useState<ChecklistEvent[]>([]);
  const { timeInMilliseconds } = useTimer();

  const addEvent = (eventName: string) => {
    const newEvent: ChecklistEvent = {
      id: uuid(),
      name: eventName,
      timestampInMilliseconds: timeInMilliseconds,
    };

    setEvents([...events, newEvent]);
  };

  const removeEvent = (eventName: string) => {
    const newEvent = events.filter((event) => event.name === eventName).pop();

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

  useEffect(() => {
    console.log('events', events);
    localStorage.setItem('events', JSON.stringify(events));
  }, [events]);

  const eventState = {
    events,
    addEvent,
    removeEvent,
    removeEventById,
    clearEvents,
  };

  return (
    <EventContext.Provider value={eventState}>{children}</EventContext.Provider>
  );
};

export const useEvent = () => {
  return useContext(EventContext);
};
