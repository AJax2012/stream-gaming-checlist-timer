import { Routes, Route } from 'react-router-dom';
import { Navbar } from '@/components';
import { Home, Settings } from '@/pages';
import { ApplicationProviders } from '@/store';
import './App.css';

const App = () => (
  <ApplicationProviders>
    <Navbar />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/settings" element={<Settings />} />
    </Routes>
  </ApplicationProviders>
);

export default App;
