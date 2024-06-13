import { EventTypeContainer, EventList, Header } from './components';
import { EventProvider, SettingsProvider, TimerProvider } from './store';
import './App.css';

const App = () => (
  <SettingsProvider>
    <TimerProvider>
      <EventProvider>
        <section id="main-content" className="block">
          <Header />
          <EventTypeContainer />
          <EventList />
        </section>
      </EventProvider>
    </TimerProvider>
  </SettingsProvider>
);

export default App;
