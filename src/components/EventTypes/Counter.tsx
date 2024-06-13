import { useMemo } from 'react';
import { useEvent, useTimer } from '@/store';
import { Button, Input, Label } from '../ui';

type Props = {
  max?: number;
  label: string;
};

const Counter = ({ max, label }: Props) => {
  const { addEvent, removeEvent, events } = useEvent();
  const { isActive, isPaused } = useTimer();

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

  return (
    <tr>
      <td><Label className="font-semibold text-xl">{label}</Label></td>
      <td className="flex justify-center">
        <Button onClick={decrement} disabled={!canDecrement || !isActive || isPaused} className="rounded-none rounded-s-lg">
          -
        </Button>
        <Input
          type="number"
          className="rounded-none text-right w-fit max-w-16"
          value={count}
          disabled
        />
        <Button onClick={increment} disabled={!canIncrement || !isActive || isPaused} className="rounded-none rounded-e-lg">
          +
        </Button>
      </td>
    </tr>
  );
};

export default Counter;
