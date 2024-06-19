import { createContext, useContext, useState, useEffect } from 'react';
import { TimerInterval } from '@/types';
import { RgbColor, RgbaColor } from 'react-colorful';

const defaultTimerInterval: TimerInterval = 1000;

type SettingsProviderType = {
  allowBreaks: boolean;
  backgroundColor: RgbaColor;
  backgroundPicture: string;
  cardColor: RgbaColor;
  eventTitle: string;
  fontColor: RgbColor;
  timerIntervalInMilliseconds: TimerInterval;
  timerPauseColor: RgbColor;
  setAllowBreaks: (allowBreaks: boolean) => void;
  setBackgroundColor: (backgroundColor: RgbaColor) => void;
  setBackgroundPicture: (backgroundPicture: string) => void;
  setCardColor: (cardColor: RgbaColor) => void;
  setEventTitle: (eventTitle: string) => void;
  setFontColor: (fontColor: RgbColor) => void;
  setTimerIntervalInMilliseconds: (timerInterval: TimerInterval) => void;
  setTimerPauseColor: (timerPauseColor: RgbColor) => void;
  resetBackgroundPicture: () => void;
  resetCustomizations: () => void;
};

type Props = {
  children: JSX.Element | JSX.Element[];
};

const SettingsContext = createContext<SettingsProviderType>(
  {} as SettingsProviderType
);

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

  const [backgroundPicture, setBackgroundPicture] = useState(
    localStorage.getItem('backgroundPicture') || ''
  );
  const [backgroundColor, setBackgroundColor] = useState<RgbaColor>(
    localStorage.getItem('backgroundColor')
      ? JSON.parse(localStorage.getItem('backgroundColor') as string)
      : { r: 248, g: 250, b: 252, a: 1 }
  );
  const [cardColor, setCardColor] = useState<RgbaColor>(
    localStorage.getItem('cardColor')
      ? JSON.parse(localStorage.getItem('cardColor') as string)
      : { r: 255, g: 255, b: 255, a: 0.5 }
  );
  const [timerPauseColor, setTimerPauseColor] = useState<RgbColor>(
    localStorage.getItem('timerPauseColor')
      ? JSON.parse(localStorage.getItem('timerPauseColor') as string)
      : { r: 239, g: 68, b: 68 }
  );
  const [fontColor, setFontColor] = useState<RgbColor>(
    localStorage.getItem('fontColor')
      ? JSON.parse(localStorage.getItem('fontColor') as string)
      : { r: 0, g: 0, b: 0 }
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

  useEffect(() => {
    localStorage.setItem('backgroundPicture', backgroundPicture);
    localStorage.setItem('backgroundColor', JSON.stringify(backgroundColor));
    localStorage.setItem('cardColor', JSON.stringify(cardColor));
    localStorage.setItem('fontColor', JSON.stringify(fontColor));
    localStorage.setItem('timerPauseColor', JSON.stringify(timerPauseColor));
  }, [
    backgroundPicture,
    backgroundColor,
    cardColor,
    fontColor,
    timerPauseColor,
  ]);

  useEffect(() => {
    document.body.style.backgroundColor = `rgba(${backgroundColor.r}, ${backgroundColor.g}, ${backgroundColor.b}, ${backgroundColor.a})`;
    document.body.style.backgroundImage = `url(${backgroundPicture})`;
    document.body.style.setProperty(
      '--card-foreground',
      `rgb(${fontColor.r}, ${fontColor.g}, ${fontColor.b})`
    );
  }, [backgroundColor, backgroundPicture, fontColor]);

  const resetBackgroundPicture = () => {
    setBackgroundPicture('');
  };

  const resetCustomizations = () => {
    setBackgroundPicture('');
    setBackgroundColor({ r: 248, g: 250, b: 252, a: 1 });
    setCardColor({ r: 255, g: 255, b: 255, a: 0.5 });
    setFontColor({ r: 0, g: 0, b: 0 });
    setTimerPauseColor({ r: 239, g: 68, b: 68 });
  };

  const settingsState = {
    allowBreaks,
    backgroundColor,
    backgroundPicture,
    cardColor,
    eventTitle,
    fontColor,
    timerIntervalInMilliseconds,
    timerPauseColor,
    setAllowBreaks,
    setBackgroundColor,
    setBackgroundPicture,
    setCardColor,
    setEventTitle,
    setFontColor,
    setTimerIntervalInMilliseconds,
    setTimerPauseColor,
    resetBackgroundPicture,
    resetCustomizations,
  };

  return (
    <SettingsContext.Provider value={settingsState}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
