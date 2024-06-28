import { createContext, useState, useEffect, useRef, RefObject } from 'react';
import type { FireworksHandlers } from '@fireworks-js/react';
import { v4 as uuid } from 'uuid';
import { Achievement, ChecklistEvent } from '@/types';
import { useTimer } from './context';
import { getItemFromLocalStorageOrDefault } from './utils';

type EventProviderType = {
  events: ChecklistEvent[];
  fireworksHidden: boolean;
  fireworksRef: RefObject<FireworksHandlers & HTMLDivElement>;
  addEvent: (achievement: Achievement, timeStampOverride?: number) => void;
  hideFireworks: () => void;
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
  const fireworksRef = useRef<FireworksHandlers & HTMLDivElement>(null);
  const [fireworksHidden, setFireworksHidden] = useState(false);
  const [events, setEvents] = useState<ChecklistEvent[]>(
    getItemFromLocalStorageOrDefault('events', [])
  );

  /* Achievements */
  const isAchievementCompleted = (achievement: Achievement) => {
    if (!achievement.celebrateOnCompleted) {
      return false;
    }

    const eventsCount =
      events.filter((event) => event.achievementId === achievement.id).length +
      1;

    if (achievement.type === 'completed' && eventsCount === 1) {
      return true;
    }

    return eventsCount === achievement.max;
  };

  /* Events */
  const addEvent = (achievement: Achievement, timeStampOverride?: number) => {
    const newEvent: ChecklistEvent = {
      id: uuid(),
      achievementId: achievement.id,
      label: achievement.label,
      timestampInMilliseconds: timeStampOverride || timeInMilliseconds,
    };

    if (isAchievementCompleted(achievement)) {
      fireworksRef.current?.start();
      setFireworksHidden(false);
    }

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

  /* Fireworks */
  const hideFireworks = () => {
    if (fireworksRef.current) {
      fireworksRef.current?.stop();
      fireworksRef.current?.clear();
      setFireworksHidden(true);
    }
  };

  useEffect(() => {
    if (fireworksRef?.current && timeInMilliseconds === 0) {
      hideFireworks();
    }
  }, [fireworksRef?.current, timeInMilliseconds]);

  useEffect(() => {
    localStorage.setItem('events', JSON.stringify(events));
  }, [events]);

  const eventState = {
    events,
    fireworksHidden,
    fireworksRef,
    addEvent,
    hideFireworks,
    removeEvent,
    removeEventsByAchievementId,
    handleSetEvents,
  };

  return (
    <EventContext.Provider value={eventState}>{children}</EventContext.Provider>
  );
};
