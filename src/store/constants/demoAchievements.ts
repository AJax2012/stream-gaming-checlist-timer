import { v4 as uuid } from 'uuid';
import { Achievement } from '@/types';

const demoAchievements: Achievement[] = [
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

export default demoAchievements;
