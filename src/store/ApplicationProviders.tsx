import { AchievementProvider } from './AchievementContext';
import { EventProvider } from './EventContext';
import { FireworksProvider } from './FireworksContext';
import { SettingsProvider } from './SettingsContext';
import { TimerProvider } from './TimerContext';

type Props = {
  children: JSX.Element | JSX.Element[];
};

const ApplicationProviders = ({ children }: Props) => (
  <SettingsProvider>
    <TimerProvider>
      <EventProvider>
        <AchievementProvider>
          <FireworksProvider>{children}</FireworksProvider>
        </AchievementProvider>
      </EventProvider>
    </TimerProvider>
  </SettingsProvider>
);

export default ApplicationProviders;
