import { createContext, useContext, useState, useEffect } from 'react';

type TimerInterval = 10 | 100 | 1000;
const defaultTimerInterval: TimerInterval = 1000;

type SettingsProviderType = {
  allowBreaks: boolean;
  eventTitle: string;
  timerIntervalInMilliseconds: TimerInterval;
  setAllowBreaks: (allowBreaks: boolean) => void;
  setEventTitle: (eventTitle: string) => void;
  setTimerIntervalInMilliseconds: (timerInterval: TimerInterval) => void;
};

type Props = {
  children: JSX.Element | JSX.Element[];
};

const SettingsContext = createContext<SettingsProviderType>({
  allowBreaks: true,
  eventTitle: '',
  timerIntervalInMilliseconds: defaultTimerInterval,
  setAllowBreaks: () => {},
  setEventTitle: () => {},
  setTimerIntervalInMilliseconds: () => {},
});

const parseTimerInterval = (timerInterval: number | string): TimerInterval => {
  const validTimerIntervals = [10, 100, 1000];

  if (validTimerIntervals.includes(Number(timerInterval) as TimerInterval)) {
    return Number(timerInterval) as TimerInterval;
  }

  return defaultTimerInterval;
};

export const SettingsProvider = ({ children }: Props): JSX.Element => {
  const [allowBreaks, setAllowBreaks] = useState(true);
  const [eventTitle, setEventTitle] = useState('Test Event');
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

  const settingsState = {
    allowBreaks,
    eventTitle,
    timerIntervalInMilliseconds,
    setAllowBreaks,
    setEventTitle,
    setTimerIntervalInMilliseconds,
  };

  return (
    <SettingsContext.Provider value={settingsState}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
