import { useMemo } from 'react';
import cn from 'classnames';
import { FaMinus, FaPlus } from 'react-icons/fa';
import { Button, Input } from '@/components/ui';
import { useEvent, useTimer } from '@/store';
import { Achievement } from '@/types';

type Props = {
  achievement: Achievement;
  isEditMode: boolean;
};

const CounterInput = ({ achievement, isEditMode }: Props) => {
  const { id, max } = achievement;
  const { addEvent, events, removeEvent } = useEvent();
  const { isActive, isPaused } = useTimer();

  const count = useMemo(() => {
    return events.filter((event) => event.achievementId === id).length;
  }, [events, id]);

  const canIncrement = useMemo(() => !max || count < max, [count, max]);

  const canDecrement = useMemo(() => count > 0, [count]);

  const increment = () => {
    if (canIncrement) {
      addEvent(achievement);
    }
  };

  const decrement = () => {
    if (count > 0) {
      const eventToDelete = events
        .filter((event) => event.achievementId === id)
        .pop();
      removeEvent(eventToDelete?.id as string);
    }
  };

  return (
    <div className={cn("items-center justify-center sm:gap-0 gap-1", {"sm:flex hidden": isEditMode, "flex": !isEditMode})}>
      <Button
        onClick={decrement}
        disabled={!canDecrement || !isActive || isPaused}
        className="sm:flex items-center justify-center hidden rounded-r-none"
      >
        <span className="sr-only">Decrement</span>
        <FaMinus size={10} />
      </Button>
      <Input
        type="number"
        className="text-center mx-auto sm:pr-0 xs:px-0 h-12 sm:h-10 w-16 max-w-16 sm:rounded-none border-gray-400"
        value={count}
        disabled
      />
      <Button
        onClick={increment}
        disabled={!canIncrement || !isActive || isPaused}
        className="sm:flex items-center justify-center hidden rounded-l-none"
      >
        <span className="sr-only">Increment</span>
        <FaPlus size={10} />
      </Button>
      <div className="sm:hidden flex flex-col gap-0.5 h-12">
        <Button
          onClick={increment}
          disabled={!canIncrement || !isActive || isPaused}
          className="h-1/2 rounded"
        >
          <FaPlus size={8} />
        </Button>
        <Button
          onClick={decrement}
          disabled={!canDecrement || !isActive || isPaused}
          className="h-1/2 rounded"
        >
          <FaMinus size={8} />
        </Button>
      </div>
    </div>
  );
};

export default CounterInput;
