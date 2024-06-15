import { useMemo } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useEvent, useTimer } from '@/store';
import { Button, Card, Input, Label } from '../ui';
import { MdDragIndicator } from 'react-icons/md';

type Props = {
  id: string;
  max?: number;
  label: string;
};

const Counter = ({ id, max, label }: Props) => {
  const { addEvent, removeEvent, events } = useEvent();
  const { isActive, isPaused } = useTimer();
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const count = useMemo(() => {
    return events.filter((event) => event.name === label).length;
  }, [events, label]);

  const canIncrement = useMemo(() => !max || count < max, [count, max]);

  const canDecrement = useMemo(() => count > 0, [count]);

  const increment = () => {
    if (canIncrement) {
      addEvent(label);
    }
  };

  const decrement = () => {
    if (count > 0) {
      removeEvent(label);
    }
  };

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <tr ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <td className='border-2 rounded-l-lg border-r-0 p-4'>
        <Label className="mr-8 font-semibold text-xl">{label}</Label>
      </td>
      <td className='border-y-2 p-4'>
        <span className="flex justify-center flex-nowrap">
          <Button
            onClick={decrement}
            disabled={!canDecrement || !isActive || isPaused}
            className="rounded-none rounded-s-lg"
          >
            -
          </Button>
          <Input
            type="number"
            className="rounded-none text-right w-fit max-w-16"
            value={count}
            disabled
          />
          <Button
            onClick={increment}
            disabled={!canIncrement || !isActive || isPaused}
            className="rounded-none rounded-e-lg"
          >
            +
          </Button>
        </span>
      </td>
      <td className='border-2 rounded-r-lg border-l-0 p-4'>
        <MdDragIndicator className="text-2xl" />
      </td>
    </tr>
  );
};

export default Counter;
