import { useMemo } from 'react';
import { FaTrashAlt } from 'react-icons/fa';
import { Duration } from 'luxon';
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
  const { events, removeEventById } = useEvent();
  const { timerIntervalInMilliseconds } = useSettings();

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
    <Card className="mx-60">
      <CardHeader>
        <CardTitle>Events</CardTitle>
      </CardHeader>
      <CardContent>
        <ListGroup>
          {events.map((event) => (
            <ListGroupItem key={event.id} className="flex justify-between py-2">
              <span>{event.name}</span>
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
