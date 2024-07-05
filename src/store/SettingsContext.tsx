import { createContext, useState, useEffect } from 'react';
import { CompletedButtonVariant, TimerInterval } from '@/types';
import { RgbColor, RgbaColor } from 'react-colorful';
import { getItemFromLocalStorageOrDefault } from './utils';
import { colord } from 'colord';

const defaultTimerInterval: TimerInterval = 1000;

type SettingsProviderType = {
  backgroundColor: RgbaColor;
  backgroundPicture: string;
  completedButtonVariant: CompletedButtonVariant;
  cardColor: RgbaColor;
  eventTitle: string;
  fontColor: RgbColor;
  timerIntervalInMilliseconds: TimerInterval;
  timerPauseColor: RgbColor;
  setBackgroundColor: (backgroundColor: RgbaColor) => void;
  setBackgroundPicture: (backgroundPicture: string) => void;
  setCardColor: (cardColor: RgbaColor) => void;
  setCompletedButtonVariant: (
    completedButtonVariant: CompletedButtonVariant
  ) => void;
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

export const SettingsContext = createContext<SettingsProviderType>(
  {} as SettingsProviderType
);

export const SettingsProvider = ({ children }: Props): JSX.Element => {
  const [eventTitle, setEventTitle] = useState(
    getItemFromLocalStorageOrDefault(
      'eventTitle',
      'Please update event title in the settings page'
    )
  );

  const [timerIntervalInMilliseconds, setTimerIntervalInMilliseconds] =
    useState<TimerInterval>(
      getItemFromLocalStorageOrDefault('timerInterval', defaultTimerInterval)
    );

  const [backgroundPicture, setBackgroundPicture] = useState(
    getItemFromLocalStorageOrDefault('backgroundPicture', '')
  );

  const [backgroundColor, setBackgroundColor] = useState<RgbaColor>(
    getItemFromLocalStorageOrDefault('backgroundColor', {
      r: 248,
      g: 250,
      b: 252,
      a: 1,
    })
  );

  const [cardColor, setCardColor] = useState<RgbaColor>(
    getItemFromLocalStorageOrDefault('cardColor', {
      r: 255,
      g: 255,
      b: 255,
      a: 0.5,
    })
  );

  const [completedButtonVariant, setCompletedButtonVariant] =
    useState<CompletedButtonVariant>(
      getItemFromLocalStorageOrDefault('completedButtonVariant', 'outline')
    );

  const [timerPauseColor, setTimerPauseColor] = useState<RgbColor>(
    getItemFromLocalStorageOrDefault('timerPauseColor', {
      r: 239,
      g: 68,
      b: 68,
    })
  );

  const [fontColor, setFontColor] = useState<RgbColor>(
    getItemFromLocalStorageOrDefault('fontColor', { r: 0, g: 0, b: 0 })
  );

  useEffect(() => {
    localStorage.setItem(
      'timerInterval',
      timerIntervalInMilliseconds.toString()
    );
  }, [timerIntervalInMilliseconds]);

  useEffect(() => {
    document.title = eventTitle;
    localStorage.setItem('eventTitle', eventTitle);
  }, [eventTitle]);

  useEffect(() => {
    localStorage.setItem('backgroundPicture', backgroundPicture);
    localStorage.setItem('backgroundColor', JSON.stringify(backgroundColor));
    localStorage.setItem('cardColor', JSON.stringify(cardColor));
    localStorage.setItem(
      'completedButtonVariant',
      JSON.stringify(completedButtonVariant)
    );
    localStorage.setItem('fontColor', JSON.stringify(fontColor));
    localStorage.setItem('timerPauseColor', JSON.stringify(timerPauseColor));
  }, [
    backgroundPicture,
    backgroundColor,
    cardColor,
    completedButtonVariant,
    fontColor,
    timerPauseColor,
  ]);

  useEffect(() => {
    document.body.style.backgroundColor = colord(backgroundColor).toRgbString();
    document.body.style.backgroundImage = `url(${backgroundPicture})`;
    document.body.style.setProperty(
      '--card-foreground',
      colord(cardColor).toRgbString()
    );
  }, [backgroundColor, backgroundPicture, fontColor]);

  const resetBackgroundPicture = () => {
    setBackgroundPicture('');
  };

  const resetCustomizations = () => {
    setBackgroundPicture('');
    setBackgroundColor({ r: 248, g: 250, b: 252, a: 1 });
    setCardColor({ r: 255, g: 255, b: 255, a: 0.5 });
    setCompletedButtonVariant('outline');
    setFontColor({ r: 0, g: 0, b: 0 });
    setTimerPauseColor({ r: 239, g: 68, b: 68 });
  };

  const settingsState = {
    backgroundColor,
    backgroundPicture,
    cardColor,
    completedButtonVariant,
    eventTitle,
    fontColor,
    timerIntervalInMilliseconds,
    timerPauseColor,
    setBackgroundColor,
    setBackgroundPicture,
    setCardColor,
    setCompletedButtonVariant,
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
