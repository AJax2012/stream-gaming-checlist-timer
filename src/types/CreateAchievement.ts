import AchievementType from './AchievementType';

type CreateAchievement = {
  label: string;
  type: AchievementType;
  max?: number;
  celebrateOnCompleted: boolean;
};

export default CreateAchievement;
