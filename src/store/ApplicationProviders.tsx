import { AchievementProvider } from './AchievementContext';
import { EventProvider } from './EventContext';
import { SettingsProvider } from './SettingsContext';
import { TimerProvider } from './TimerContext';

type Props = {
  children: JSX.Element | JSX.Element[];
};

const ApplicationProviders = ({ children }: Props) => (
  <SettingsProvider>
    <TimerProvider>
      <AchievementProvider>
        <EventProvider>{children}</EventProvider>
      </AchievementProvider>
    </TimerProvider>
  </SettingsProvider>
);

export default ApplicationProviders;
