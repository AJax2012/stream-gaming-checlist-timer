import cn from 'classnames';
import Fireworks from '@fireworks-js/react';
import { EventList, AchievementsList, Header } from '@/components';
import { useEvent } from '@/store';

const Home = (): JSX.Element => {
  const { fireworksRef, hideFireworks, fireworksHidden } = useEvent();

  return (
    <section id="main-content" className="block">
      <Header />
      <AchievementsList />
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
