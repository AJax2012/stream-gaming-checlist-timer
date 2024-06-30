import { useContext } from 'react';
import { TimerContext } from '../TimerContext';

const useTimer = () => useContext(TimerContext);

export default useTimer;
