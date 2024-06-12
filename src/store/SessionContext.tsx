import { createContext, useContext, useState, useEffect } from 'react';

type TimerInterval = 10 | 100 | 1000;
const defaultTimerInterval: TimerInterval = 1000;

type SessionProviderType = {
  allowBreaks: boolean;
  timerIntervalInMilliseconds: TimerInterval;
  setAllowBreaks: (allowBreaks: boolean) => void;
  setTimerIntervalInMilliseconds: (timerInterval: TimerInterval) => void;
};

type Props = {
  children: JSX.Element | JSX.Element[];
};

const SessionContext = createContext<SessionProviderType>({
  allowBreaks: true,
  timerIntervalInMilliseconds: defaultTimerInterval,
  setAllowBreaks: () => {},
  setTimerIntervalInMilliseconds: () => {},
});

const parseTimerInterval = (timerInterval: number | string): TimerInterval => {
  const validTimerIntervals = [10, 100, 1000];

  if (validTimerIntervals.includes(Number(timerInterval) as TimerInterval)) {
    return Number(timerInterval) as TimerInterval;
  }

  return defaultTimerInterval;
};

export const SessionProvider = ({ children }: Props): JSX.Element => {
  const [allowBreaks, setAllowBreaks] = useState(true);
  const [timerIntervalInMilliseconds, setTimerIntervalInMilliseconds] =
    useState<TimerInterval>(defaultTimerInterval);

  useEffect(() => {
    const storedAllowBreaks = localStorage.getItem('allowBreaks');
    const storedTimerInterval = localStorage.getItem('timerInterval');

    if (storedAllowBreaks) {
      setAllowBreaks(JSON.parse(storedAllowBreaks));
    }
    if (storedTimerInterval) {
      setTimerIntervalInMilliseconds(parseTimerInterval(storedTimerInterval));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('allowBreaks', JSON.stringify(allowBreaks));
    localStorage.setItem(
      'timerInterval',
      JSON.stringify(timerIntervalInMilliseconds)
    );
  }, [allowBreaks, timerIntervalInMilliseconds]);

  const sessionState = {
    allowBreaks,
    timerIntervalInMilliseconds,
    setAllowBreaks,
    setTimerIntervalInMilliseconds,
  };

  return (
    <SessionContext.Provider value={sessionState}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => useContext(SessionContext);
