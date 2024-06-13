import { createContext, useContext, useState, useEffect } from 'react';
import { useSettings } from './SettingsContext';

type TimerProviderType = {
  timeInMilliseconds: number;
  isActive: boolean;
  isPaused: boolean;
  start: () => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
};

type Props = {
  children: JSX.Element | JSX.Element[];
};

const TimerContext = createContext<TimerProviderType>({
  timeInMilliseconds: 0,
  isActive: false,
  isPaused: false,
  start: () => {},
  pause: () => {},
  resume: () => {},
  reset: () => {},
});

export const TimerProvider = ({ children }: Props): JSX.Element => {
  const { timerIntervalInMilliseconds, allowBreaks } = useSettings();
  const [timeInMilliseconds, setInMillisecondsTime] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const timerInterval = Number(timerIntervalInMilliseconds);
    let timeInterval: NodeJS.Timeout | undefined = undefined;
    let cacheInterval: NodeJS.Timeout | undefined = undefined;

    if (isActive && !isPaused) {
      timeInterval = setInterval(() => {
        setInMillisecondsTime((time) => time + timerInterval);
      }, timerInterval);

      cacheInterval = setInterval(() => {
        localStorage.setItem('time', timeInMilliseconds.toString());
      }, 1000);
    } else {
      clearInterval(timeInterval);
      clearInterval(cacheInterval);
    }
    return () => {
      clearInterval(timeInterval);
      clearInterval(cacheInterval);
    };
  }, [isActive, isPaused]);

  useEffect(() => {
    const storedTime = localStorage.getItem('time');
    const storedIsActive = localStorage.getItem('isActive');
    const storedIsPaused = localStorage.getItem('isPaused');

    if (storedTime) {
      const time = parseInt(storedTime);
      setInMillisecondsTime(time);
    }

    if (storedIsActive) {
      setIsActive(JSON.parse(storedIsActive));
    }

    if (storedIsPaused) {
      setIsPaused(JSON.parse(storedIsPaused));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('isActive', isActive.toString());
    localStorage.setItem('isPaused', isPaused.toString());
  }, [isActive, isPaused]);

  const start = () => {
    setInMillisecondsTime(0);
    setIsActive(true);
    setIsPaused(false);
    localStorage.setItem('time', '0');
  };

  const pause = () => {
    if (!allowBreaks) {
      return;
    }

    setIsPaused(true);
  };

  const resume = () => {
    if (!allowBreaks) {
      return;
    }

    setIsPaused(false);
  };

  const reset = () => {
    setInMillisecondsTime(0);
    setIsActive(false);
    setIsPaused(false);
    localStorage.setItem('time', '0');
  };

  const timerState = {
    timeInMilliseconds,
    isActive,
    isPaused,
    start,
    pause,
    resume,
    reset,
  };

  return (
    <TimerContext.Provider value={timerState}>{children}</TimerContext.Provider>
  );
};

export const useTimer = () => useContext(TimerContext);
