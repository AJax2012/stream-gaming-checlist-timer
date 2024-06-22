import { ChangeEvent, useMemo } from 'react';
import cn from 'classnames';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FaCheck, FaTrashAlt } from 'react-icons/fa';
import { MdClose, MdDragIndicator } from 'react-icons/md';

import { Button, Label } from '@/components/ui';
import { useEvent, useTimer } from '@/store';
import { EventType, EventTypeOption } from '@/types';

type Props = {
  eventType: EventType;
  optionSelected?: EventTypeOption;
  isEditMode: boolean;
  isRadioOption?: boolean;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
};

const Completed = ({
  eventType,
  optionSelected,
  isEditMode,
  isRadioOption = false,
  onChange,
}: Props) => {
  const { id, label } = eventType;
  const { addEvent, events, removeEventById, removeEventType } = useEvent();
  const { isActive, isPaused } = useTimer();
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const isCompleted = useMemo(() => {
    return events.filter((event) => event.eventTypeId === id).length > 0;
  }, [events, label]);

  const addCompleted = () => {
    addEvent(eventType);
  };

  const removeCompleted = () => {
    const eventToDelete = events
      .filter((event) => event.eventTypeId === id)
      .pop();
    removeEventById(eventToDelete?.id as string);
  };

  const handleRemoveEventType = () => {
    removeEventType(id);
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
    <tr ref={setNodeRef} style={style}>
      {isRadioOption && onChange && (
        <td className="border-2 rounded-l-lg border-r-0 p-4">
          <input
            type="radio"
            id="add-completed-radio"
            value="completed"
            name="type"
            className="h-4 w-4 cursor-pointer"
            checked={optionSelected === 'completed'}
            onChange={onChange}
          />
        </td>
      )}
      <td
        className={cn('py-4 pr-4 text-left', {
          'border-2 rounded-l-lg border-r-0 pl-6': !isRadioOption,
          'border-y-2 pl-2': isRadioOption,
        })}
      >
        <Label className="mr-8 font-semibold text-xl">{label}</Label>
      </td>
      <td
        className={cn('py-4 px-1 text-center', {
          'border-2 rounded-r-lg border-l-0 pl-4': !isEditMode,
          'border-y-2': isEditMode,
        })}
      >
        <Button
          onClick={toggleCompleted}
          variant="outline"
          disabled={!isActive || isPaused}
        >
          {isCompleted ? <MdClose color="red" /> : <FaCheck color="green" />}
        </Button>
      </td>
      {isEditMode && (
        <td className="border-y-2 p-4">
          <Button onClick={handleRemoveEventType} variant="outline">
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

export default Completed;
