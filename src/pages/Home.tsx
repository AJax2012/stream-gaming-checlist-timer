import { EventList, EventTypeContainer, Header } from '@/components';

const Home = () => (
  <>
    <section id="main-content" className="block">
      <Header />
      <EventTypeContainer />
      <EventList />
    </section>
  </>
);

export default Home;
