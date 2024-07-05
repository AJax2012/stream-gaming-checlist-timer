import cn from 'classnames';
import Fireworks from '@fireworks-js/react';
import { AchievementList, EventList, Header } from '@/components';
import { useFireworks, useSettings } from '@/store';
import { colord } from 'colord';

const Home = (): JSX.Element => {
  const { fireworksRef, hideFireworks, fireworksHidden } = useFireworks();
  const { fontColor } = useSettings();

  return (
    <section id="main-content" className="block" style={{ color: colord(fontColor).toHex() }}>
      <Header />
      <AchievementList />
      <EventList />
      <Fireworks
        ref={fireworksRef}
        options={{ autoresize: true }}
        onClick={hideFireworks}
        className={cn('fireworks', { hidden: fireworksHidden })}
      />
    </section>
  );
};

export default Home;
