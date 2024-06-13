import { useEvent } from '../store';
import { Completed, Counter } from './EventTypes';
import { Card } from './ui';

const EventTypesContainer = () => {
  const { eventTypes } = useEvent();

  return (
    <Card className="my-4 p-12">
      <table className="w-12 mx-auto border-separate border-spacing-4">
        {eventTypes.map((event) => (
          <>
            {event.type === 'counter' && (
              <Counter key={event.id} max={event.max} label={event.label} />
            )}
            {event.type === 'completed' && (
              <Completed key={event.id} label={event.label} />
            )}
          </>
        ))}
      </table>
    </Card>
  );
};

export default EventTypesContainer;
