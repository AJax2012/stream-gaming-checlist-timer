import { CounterItem, EventList, Timer } from './components';
import { EventProvider, SessionProvider, TimerProvider } from './store';
import './App.css';

const App = () => (
  <SessionProvider>
    <TimerProvider>
      <EventProvider>
        <div className='block'>
          <Timer />
          <CounterItem max={4} label="Test" />
          <EventList />
        </div>
      </EventProvider>
    </TimerProvider>
  </SessionProvider>
);

export default App;
