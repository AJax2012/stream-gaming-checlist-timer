import { createContext, useState } from 'react';
import { arrayMove } from '@dnd-kit/sortable';
import { v4 as uuid } from 'uuid';

import { Achievement, CreateAchievement } from '@/types';
import { demoAchievements } from './constants';
import { useEvent } from './context';
import { getItemFromLocalStorageOrDefault } from './utils';

type AchievementProviderType = {
  achievements: Achievement[];
  addAchievement: (eventSetter: CreateAchievement) => void;
  handleSetAchievements: (achievements?: Achievement[]) => void;
  reorderAchievements: (oldIndex: number, newIndex: number) => void;
  removeAchievement: (id: string) => void;
};

type Props = {
  children: JSX.Element | JSX.Element[];
};

export const AchievementContext = createContext<AchievementProviderType>(
  {} as AchievementProviderType
);

export const AchievementProvider = ({ children }: Props) => {
  const { removeEventsByAchievementId } = useEvent();
  const [achievements, setAchievements] = useState<Achievement[]>(
    getItemFromLocalStorageOrDefault('achievements', demoAchievements)
  );

  const addAchievement = (achievement: CreateAchievement) => {
    if (
      achievement.type === 'counter' &&
      !!achievement.max &&
      achievement.max < 1
    ) {
      throw new Error('Max must be greater than 0');
    }

    if (
      achievements.filter((event) => event.label === achievement.label).length >
      0
    ) {
      throw new Error('Event type already exists');
    }

    const newAchievement: Achievement = {
      ...achievement,
      id: uuid(),
    };

    setAchievements([...achievements, newAchievement]);
  };

  const handleSetAchievements = (achievements?: Achievement[]) => {
    setAchievements([...(achievements || [])]);
  };

  const removeAchievement = (id: string) => {
    removeEventsByAchievementId(id);
    setAchievements([
      ...achievements.filter((achievement) => achievement.id !== id),
    ]);
  };

  const reorderAchievements = (oldIndex: number, newIndex: number) => {
    const sortedEvents = arrayMove(achievements, oldIndex, newIndex);
    setAchievements([...sortedEvents]);
  };

  const achievementState = {
    achievements,
    addAchievement,
    handleSetAchievements,
    removeAchievement,
    reorderAchievements,
  };

  return (
    <AchievementContext.Provider value={achievementState}>
      {children}
    </AchievementContext.Provider>
  );
};
