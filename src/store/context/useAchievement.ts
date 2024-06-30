import { useContext } from 'react';
import { AchievementContext } from '../AchievementContext';

const useAchievement = () => useContext(AchievementContext);

export default useAchievement;
