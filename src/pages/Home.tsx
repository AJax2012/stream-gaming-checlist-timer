import cn from 'classnames';
import { EventList, EventTypeContainer, Header } from '@/components';
import { useEvent } from '../store';
import Fireworks from '@fireworks-js/react';

const Home = (): JSX.Element => {
  const { fireworksRef, hideFireworks, fireworksHidden } = useEvent();

  return (
    <section id="main-content" className="block">
      <Header />
      <EventTypeContainer />
      <EventList />
      <Fireworks
        ref={fireworksRef}
        options={{ autoresize: true }}
        onClick={hideFireworks}
        className={cn("fireworks", { hidden: fireworksHidden })}
      />
    </section>
  );
};

export default Home;
