import { useContext } from 'react';
import { TimerContext } from '../TimerContext';

export const useTimer = () => useContext(TimerContext);
