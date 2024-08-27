import { ChangeEvent, useMemo } from 'react';
import cn from 'classnames';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FaTrashAlt } from 'react-icons/fa';
import { MdDragIndicator } from 'react-icons/md';

import { useAchievement, useEvent, useTimer } from '@/store';
import { Achievement, AchievementType } from '@/types';
import { Button, Input, Label } from '../ui';

type Props = {
  achievement: Achievement;
  achievementTypeSelected?: AchievementType;
  isEditMode: boolean;
  isRadioOption?: boolean;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
};

const Counter = ({
  achievement,
  achievementTypeSelected,
  isEditMode,
  isRadioOption = false,
  onChange,
}: Props) => {
  const { id, label, max } = achievement;

  const { removeAchievement } = useAchievement();
  const { addEvent, events, removeEvent } = useEvent();
  const { isActive, isPaused } = useTimer();
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

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

  const handleRemoveAchievement = () => {
    removeAchievement(id);
  };

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <tr ref={setNodeRef} style={style}>
      {isRadioOption && onChange && (
        <td className="border-2 rounded-l-lg border-r-0 p-4">
          <input
            type="radio"
            id="add-counter-radio"
            value="counter"
            name="type"
            className="h-4 w-4 cursor-pointer"
            checked={achievementTypeSelected === 'counter'}
            onChange={onChange}
          />
        </td>
      )}
      <td
        className={cn('py-4 text-left', {
          'border-2 rounded-l-lg border-r-0 pl-6': !isRadioOption,
          'border-y-2 pl-2': isRadioOption,
        })}
      >
        <Label className="mr-8 font-semibold text-xl">{label}</Label>
        {max && <p className="text-sm text-muted-foreground">Needed: {max}</p>}
      </td>
      <td
        className={cn('py-4 px-1 text-center', {
          'border-2 rounded-r-lg border-l-0 pr-5': !isEditMode,
          'border-y-2': isEditMode,
        })}
      >
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
      {isEditMode && (
        <td className="border-y-2 p-4">
          <Button onClick={handleRemoveAchievement} variant="outline">
            <FaTrashAlt className="cursor-pointer" />
          </Button>
        </td>
      )}
      {isEditMode && (
        <td className="border-2 rounded-r-lg border-l-0 p-4">
          <div {...attributes} {...listeners}>
            <MdDragIndicator className="text-2xl" />
          </div>
        </td>
      )}
    </tr>
  );
};

export default Counter;
