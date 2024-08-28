import { ChangeEvent } from 'react';
import cn from 'classnames';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FaTrashAlt } from 'react-icons/fa';
import { MdDragIndicator } from 'react-icons/md';

import { useAchievement } from '@/store';
import { Achievement, AchievementType } from '@/types';
import CounterInput from './CounterInput.tsx';
import { Button, Label } from '../ui';

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
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

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
        className={cn('py-4 text-center', {
          'border-2 rounded-r-lg border-l-0 px-5': !isEditMode,
          'border-y-2 px-1 sm:table-cell hidden': isEditMode,
        })}
      >
        <CounterInput achievement={achievement} isEditMode={isEditMode} />
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
