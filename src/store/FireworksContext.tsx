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

  const [
    celebratedAchievementsCount,
    setCelebratedAchievementsCount,
  ] = useState(
    getItemFromLocalStorageOrDefault('celebratedAchievementsCount', 0)
  );

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

  const getCompletedCelebrationAchievementsCount = useCallback(
    (achievements: Achievement[], events: ChecklistEvent[]) =>
      achievements.filter((achievement) =>
        isAchievementCompleted(achievement, events)
      ).length,
    [isAchievementCompleted]
  );

  const showFireworks = useCallback(() => {
    setFireworksHidden(false);
    if (fireworksRef.current) {
      fireworksRef.current?.start();
    }
  }, []);

  const hideFireworksCallback = useCallback(
    (achievements: Achievement[], events: ChecklistEvent[]) => {
      setFireworksHidden(true);
      setCelebratedAchievementsCount(
        getCompletedCelebrationAchievementsCount(achievements, events)
      );

      if (fireworksRef.current) {
        fireworksRef.current?.stop();
        fireworksRef.current?.clear();
      }
    },
    [getCompletedCelebrationAchievementsCount]
  );

  const hideFireworks = () => {
    hideFireworksCallback(achievements, events);
  };

  useEffect(() => {
    const completedCelebrationAchievements =
      getCompletedCelebrationAchievementsCount(achievements, events);

    if (
      completedCelebrationAchievements > 0 &&
      completedCelebrationAchievements > celebratedAchievementsCount
    ) {
      showFireworks();
    } else {
      hideFireworksCallback(achievements, events);
    }
  }, [
    achievements,
    celebratedAchievementsCount,
    getCompletedCelebrationAchievementsCount,
    events,
    hideFireworksCallback,
    showFireworks,
  ]);

  useEffect(() => {
    localStorage.setItem('fireworksHidden', String(fireworksHidden));
    localStorage.setItem(
      'celebratedAchievementsCount',
      String(celebratedAchievementsCount)
    );
  }, [fireworksHidden, celebratedAchievementsCount]);

  const fireworksState = {
    fireworksHidden,
    fireworksRef,
    hideFireworks,
  };

  return (
    <FireworksContext.Provider value={fireworksState}>
      {children}
    </FireworksContext.Provider>
  );
};
