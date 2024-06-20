import { createContext, useState, useEffect } from 'react';
import { useSettings } from './utils/useSettings';
import { getItemFromLocalStorageOrDefault } from './utils';

type TimerProviderType = {
  timeInMilliseconds: number;
  isActive: boolean;
  isPaused: boolean;
  setTimer: (timeInMilliseconds: number) => void;
  start: () => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
};

type Props = {
  children: JSX.Element | JSX.Element[];
};

export const TimerContext = createContext<TimerProviderType>(
  {} as TimerProviderType
);

export const TimerProvider = ({ children }: Props): JSX.Element => {
  const { timerIntervalInMilliseconds } = useSettings();
  const [timeInMilliseconds, setTimeInMilliseconds] = useState(
    getItemFromLocalStorageOrDefault('time', 0)
  );
  const [isActive, setIsActive] = useState(
    getItemFromLocalStorageOrDefault('isActive', false)
  );
  const [isPaused, setIsPaused] = useState(
    getItemFromLocalStorageOrDefault('isPaused', false)
  );

  useEffect(() => {
    const timerInterval = Number(timerIntervalInMilliseconds);
    let timeInterval: NodeJS.Timeout | undefined = undefined;

    if (isActive && !isPaused) {
      timeInterval = setInterval(() => {
        setTimeInMilliseconds((time) => time + timerInterval);
      }, timerInterval);
    } else {
      clearInterval(timeInterval);
    }

    return () => {
      clearInterval(timeInterval);
    };
  }, [isActive, isPaused]);

  useEffect(() => {
    const cachedTimeInMilliseconds = Number(localStorage.getItem('time') || 0);
    if (timeInMilliseconds - cachedTimeInMilliseconds >= 1000) {
      localStorage.setItem('time', timeInMilliseconds.toString());
    }
  }, [timeInMilliseconds]);

  useEffect(() => {
    localStorage.setItem('isActive', isActive.toString());
    localStorage.setItem('isPaused', isPaused.toString());
  }, [isActive, isPaused]);

  const start = () => {
    setTimeInMilliseconds(0);
    setIsActive(true);
    setIsPaused(false);
    localStorage.setItem('time', '0');
  };

  const pause = () => {
    setIsPaused(true);
  };

  const resume = () => {
    setIsPaused(false);
  };

  const reset = () => {
    setTimeInMilliseconds(0);
    setIsActive(false);
    setIsPaused(false);
    localStorage.setItem('time', '0');
  };

  const setTimer = (timeInMilliseconds: number) => {
    setTimeInMilliseconds(timeInMilliseconds);
    localStorage.setItem('time', timeInMilliseconds.toString());

    if (timeInMilliseconds !== 0) {
      setIsActive(true);
      setIsPaused(true);
    }
  };

  const timerState = {
    timeInMilliseconds,
    isActive,
    isPaused,
    setTimer,
    start,
    pause,
    resume,
    reset,
  };

  return (
    <TimerContext.Provider value={timerState}>{children}</TimerContext.Provider>
  );
};
