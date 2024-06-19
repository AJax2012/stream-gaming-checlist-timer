import { Routes, Route } from 'react-router-dom';
import { Navbar } from '@/components';
import { Home, Settings } from '@/pages';
import { EventProvider, SettingsProvider, TimerProvider } from '@/store';
import './App.css';

const App = () => (
  <SettingsProvider>
    <TimerProvider>
      <EventProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </EventProvider>
    </TimerProvider>
  </SettingsProvider>
);

export default App;
