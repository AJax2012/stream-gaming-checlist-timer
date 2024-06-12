import './App.css';
import { Timer } from './components';
import { SessionProvider } from './store/SessionContext';
import { TimerProvider } from './store/TimerContext';

const App = () => (
  <SessionProvider>
    <TimerProvider>
      <Timer />
    </TimerProvider>
  </SessionProvider>
);

export default App;
