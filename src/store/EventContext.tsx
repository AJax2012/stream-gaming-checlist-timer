import { createContext, useState, useEffect } from 'react';
import { v4 as uuid } from 'uuid';
import type { Achievement, ChecklistEvent } from '@/types';
import { useTimer } from './context';
import { getItemFromLocalStorageOrDefault } from './utils';

type EventProviderType = {
  events: ChecklistEvent[];
  addEvent: (achievement: Achievement, timeStampOverride?: number) => void;
  removeEvent: (eventId: string) => void;
  removeEventsByAchievementId: (achievementId: string) => void;
  handleSetEvents: (events?: ChecklistEvent[]) => void;
};

type Props = {
  children: JSX.Element | JSX.Element[];
};

export const EventContext = createContext<EventProviderType>(
  {} as EventProviderType
);

export const EventProvider = ({ children }: Props) => {
  const { timeInMilliseconds } = useTimer();
  const [events, setEvents] = useState<ChecklistEvent[]>(
    getItemFromLocalStorageOrDefault('events', [])
  );

  /* Achievements */

  /* Events */
  const addEvent = (achievement: Achievement, timeStampOverride?: number) => {
    const newEvent: ChecklistEvent = {
      id: uuid(),
      achievementId: achievement.id,
      label: achievement.label,
      timestampInMilliseconds: timeStampOverride || timeInMilliseconds,
    };

    setEvents([...events, newEvent]);
  };

  const handleSetEvents = (events?: ChecklistEvent[]) => {
    setEvents([...(events || [])]);
  };

  const removeEvent = (eventId: string) => {
    setEvents([...events.filter((event) => event.id !== eventId)]);
  };

  const removeEventsByAchievementId = (achievementId: string) => {
    setEvents([
      ...events.filter((event) => event.achievementId !== achievementId),
    ]);
  };

  useEffect(() => {
    localStorage.setItem('events', JSON.stringify(events));
  }, [events]);

  const eventState = {
    events,
    addEvent,
    removeEvent,
    removeEventsByAchievementId,
    handleSetEvents,
  };

  return (
    <EventContext.Provider value={eventState}>{children}</EventContext.Provider>
  );
};
