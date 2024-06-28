import {
  createContext,
  useState,
  useEffect,
  useRef,
  type RefObject,
  useCallback,
} from 'react';
import type { FireworksHandlers } from '@fireworks-js/react';

import type { Achievement, ChecklistEvent } from '@/types';

import { useAchievement, useEvent } from './context';
import { getItemFromLocalStorageOrDefault } from './utils';

type FireworksProviderType = {
  fireworksHidden: boolean;
  fireworksRef: RefObject<FireworksHandlers & HTMLDivElement>;
  hideFireworks: () => void;
  showFireworks: () => void;
};

type Props = {
  children: JSX.Element | JSX.Element[];
};

export const FireworksContext = createContext<FireworksProviderType>(
  {} as FireworksProviderType
);

export const FireworksProvider = ({ children }: Props) => {
  const { events } = useEvent();
  const { achievements } = useAchievement();
  const fireworksRef = useRef<FireworksHandlers & HTMLDivElement>(null);

  const [fireworksHidden, setFireworksHidden] = useState(
    getItemFromLocalStorageOrDefault('fireworksHidden', false)
  );

  const [eventCount, setEventCount] = useState(events.length);
  const [achievementCount, setAchievementCount] = useState(achievements.length);

  const showFireworks = useCallback(() => {
    if (fireworksRef.current) {
      fireworksRef.current?.start();
      setFireworksHidden(false);
    }
  }, []);

  const hideFireworks = useCallback(() => {
    if (fireworksRef.current) {
      fireworksRef.current?.stop();
      fireworksRef.current?.clear();
      setFireworksHidden(true);
    }
  }, []);

  const isAchievementCompleted = useCallback(
    (achievement: Achievement, events: ChecklistEvent[]) => {
      if (!achievement.celebrateOnCompleted) {
        return false;
      }

      const achievementEvents = events.filter(
        (event) => event.achievementId === achievement.id
      );

      if (achievement.type === 'completed' && achievementEvents.length > 0) {
        return true;
      }

      return achievementEvents.length === achievement.max;
    },
    []
  );

  useEffect(() => {
    const completedCelebrationAchievements = achievements.filter(
      (achievement) => isAchievementCompleted(achievement, events)
    );

    if (!fireworksHidden && completedCelebrationAchievements?.length > 0) {
      showFireworks();
    } else {
      hideFireworks();
    }
  }, [
    achievements,
    events,
    fireworksHidden,
    hideFireworks,
    isAchievementCompleted,
    showFireworks,
  ]);

  useEffect(() => {
    localStorage.setItem('fireworksHidden', String(fireworksHidden));
  }, [fireworksHidden]);

  useEffect(() => {
    if (
      achievements.length !== achievementCount ||
      events.length !== eventCount
    ) {
      setAchievementCount(achievements.length);
      setEventCount(events.length);
      setFireworksHidden(false);
    }
  }, [achievements.length, events.length, eventCount, achievementCount]);

  const fireworksState = {
    fireworksHidden,
    fireworksRef,
    hideFireworks,
    showFireworks,
  };

  return (
    <FireworksContext.Provider value={fireworksState}>
      {children}
    </FireworksContext.Provider>
  );
};
