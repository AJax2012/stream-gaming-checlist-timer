import { useMemo } from 'react';
import { Duration } from 'luxon';
import { FaTrashAlt } from 'react-icons/fa';
import { useEvent, useSettings } from '@/store';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  ListGroup,
  ListGroupItem,
} from './ui';

const EventList = () => {
  const { events, removeEvent: removeEventById } = useEvent();
  const { timerIntervalInMilliseconds, cardColor } = useSettings();

  const format = useMemo(() => {
    switch (timerIntervalInMilliseconds) {
      case 10:
      case 100:
        return 'h:mm:ss.SSS';
      case 1000:
        return 'h:mm:ss';
    }
  }, [timerIntervalInMilliseconds]);

  return (
    <Card
      className="mx-auto max-w-2xl my-4"
      style={{
        backgroundColor: `rgba(${cardColor.r}, ${cardColor.g}, ${cardColor.b}, ${cardColor.a})`,
      }}
    >
      <CardHeader>
        <CardTitle>Events</CardTitle>
      </CardHeader>
      <CardContent>
        <ListGroup>
          {events.map((event) => (
            <ListGroupItem key={event.id} className="flex justify-between py-2">
              <span>{event.label}</span>
              <span className="flex gap-3">
                <span>
                  {Duration.fromMillis(event.timestampInMilliseconds).toFormat(
                    format
                  )}
                </span>
                <FaTrashAlt
                  onClick={() => removeEventById(event.id)}
                  color="gray"
                  className="my-1 hover:cursor-pointer"
                />
              </span>
            </ListGroupItem>
          ))}
        </ListGroup>
      </CardContent>
    </Card>
  );
};

export default EventList;
