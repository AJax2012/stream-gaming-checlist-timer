import cn from 'classnames';
import Fireworks from '@fireworks-js/react';
import { AchievementList, EventList, Header } from '@/components';
import { useFireworks } from '@/store';

const Home = (): JSX.Element => {
  const { fireworksRef, hideFireworks, fireworksHidden } = useFireworks();

  return (
    <section id="main-content" className="block">
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
