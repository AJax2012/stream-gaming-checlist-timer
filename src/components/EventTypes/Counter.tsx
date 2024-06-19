import { useMemo } from 'react';
import cn from 'classnames';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { MdDragIndicator } from 'react-icons/md';
import { Button, Input, Label } from '@/components/ui';
import { useEvent, useTimer } from '@/store';
import { EventTypeOption } from '@/types';
import { FaTrashAlt } from 'react-icons/fa';

type Props = {
  id: string;
  max?: number;
  label: string;
  optionSelected?: EventTypeOption;
  isEditMode: boolean;
  isRadioOption?: boolean;
  toggleSelected?: (value: EventTypeOption) => void;
};

const Counter = ({
  id,
  max,
  label,
  optionSelected,
  isEditMode,
  isRadioOption = false,
  toggleSelected,
}: Props) => {
  const { addEvent, removeEvent, events, removeEventType } = useEvent();
  const { isActive, isPaused } = useTimer();
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const count = useMemo(() => {
    return events.filter((event) => event.name === label).length;
  }, [events, label]);

  const canIncrement = useMemo(() => !max || count < max, [count, max]);

  const canDecrement = useMemo(() => count > 0, [count]);

  const increment = () => {
    console.log('increment');
    if (canIncrement) {
      addEvent(label);
    }
  };

  const decrement = () => {
    if (count > 0) {
      removeEvent(label);
    }
  };

  const handleRemoveEventType = () => {
    const eventsToDelete = events.filter((event) => event.name === label);

    eventsToDelete.forEach((event) => {
      removeEvent(event.name);
    });

    removeEventType(id);
  };

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <tr ref={setNodeRef} style={style}>
      {isRadioOption && toggleSelected && (
        <td className="border-2 rounded-l-lg border-r-0 p-4">
          <input
            type="radio"
            id="add-counter-radio"
            value="counter"
            name="eventTypeSelected"
            className="h-4 w-4 cursor-pointer"
            checked={optionSelected === 'counter'}
            onChange={() => toggleSelected('completed')}
          />
        </td>
      )}
      <td
        className={cn('p-4', {
          'border-2 rounded-l-lg border-r-0 ': !isRadioOption,
          'border-y-2': isRadioOption,
        })}
      >
        <Label className="mr-8 font-semibold text-xl">{label}</Label>
      </td>
      <td className={cn("p-4", { 'border-2 rounded-r-lg border-l-0': !isEditMode, 'border-y-2': isEditMode })}>
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
          <Button
            onClick={handleRemoveEventType}
            variant="outline"
          >
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
