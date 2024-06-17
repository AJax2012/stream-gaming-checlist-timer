import { ChangeEvent, useMemo } from 'react';
import cn from 'classnames';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FaCheck } from 'react-icons/fa';
import { MdClose, MdDragIndicator } from 'react-icons/md';
import { Button, DialogClose, Input, Label } from '@/components/ui';
import { useEvent, useTimer } from '@/store';
import { EventTypeOption } from '@/types';

type Props = {
  id: string;
  label: string;
  optionSelected?: EventTypeOption;
  isRadioOption?: boolean;
  toggleSelected?: (value: EventTypeOption) => void;
};

const Completed = ({
  id,
  label,
  optionSelected,
  isRadioOption = false,
  toggleSelected,
}: Props) => {
  const { addEvent, removeEvent, events } = useEvent();
  const { isActive, isPaused } = useTimer();
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const isCompleted = useMemo(() => {
    return events.filter((event) => event.name === label).length > 0;
  }, [events, label]);

  const addCompleted = () => {
    addEvent(label);
  };

  const removeCompleted = () => {
    removeEvent(label);
  };

  const toggleCompleted = () => {
    if (isCompleted) {
      removeCompleted();
    } else {
      addCompleted();
    }
  };

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <tr ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {isRadioOption && toggleSelected && (
        <td className="border-2 rounded-l-lg border-r-0 p-4">
          <input
            type="radio"
            id="add-completed-radio"
            value="completed"
            name="eventTypeSelected"
            className="h-4 w-4 cursor-pointer"
            checked={optionSelected === 'completed'}
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
      <td className="border-y-2 p-4">
        <Button
          onClick={toggleCompleted}
          variant="outline"
          disabled={!isActive || isPaused}
          className="column-span-2"
        >
          {isCompleted ? <FaCheck color="green" /> : <MdClose color="red" />}
        </Button>
      </td>
      <td className="border-2 rounded-r-lg border-l-0 p-4">
        <MdDragIndicator className="text-2xl" />
      </td>
    </tr>
  );
};

export default Completed;
