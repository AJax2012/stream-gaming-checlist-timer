import { createContext, useContext, useState, useEffect } from 'react';
import { TimerInterval } from '@/types';

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
  const [allowBreaks, setAllowBreaks] = useState(
    localStorage.getItem('allowBreaks') === 'true'
  );
  const [eventTitle, setEventTitle] = useState(
    localStorage.getItem('eventTitle') ||
      'Please update event title in the settings page'
  );
  const [timerIntervalInMilliseconds, setTimerIntervalInMilliseconds] =
    useState<TimerInterval>(
      (Number(localStorage.getItem('timerInterval')) as TimerInterval) ||
        defaultTimerInterval
    );

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
    localStorage.setItem('allowBreaks', allowBreaks.toString());
    localStorage.setItem(
      'timerInterval',
      timerIntervalInMilliseconds.toString()
    );
  }, [allowBreaks, timerIntervalInMilliseconds]);

  useEffect(() => {
    document.title = eventTitle;
    localStorage.setItem('eventTitle', eventTitle);
  }, [eventTitle]);

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
