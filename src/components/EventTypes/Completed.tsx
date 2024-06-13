import { useMemo } from 'react';
import { useEvent, useTimer } from '@/store';
import { Button, Label } from '../ui';
import { FaCheck } from 'react-icons/fa';
import { MdClose } from 'react-icons/md';

type Props = {
  label: string;
};

const Completed = ({ label }: Props) => {
  const { addEvent, removeEvent, events } = useEvent();
  const { isActive, isPaused } = useTimer();

  const isCompleted = useMemo(() => {
    return events.filter((event) => event.name === label).length > 0;
  }, [events, label]);

  const addCompleted = () => {
    addEvent(label);
  };

  const removeCompleted = () => {
    removeEvent(label);
  }

  const toggleCompleted = () => {
    if (isCompleted) {
      removeCompleted();
    } else {
      addCompleted();
    }
  }

  return (
    <tr className="">
      <td>
        <Label className="mr-8 font-semibold text-xl">{label}</Label>
      </td>
      <td>
        <Button
          onClick={toggleCompleted}
          variant='outline'
          disabled={!isActive || isPaused}
        >
          {isCompleted ? <FaCheck color="green" /> : <MdClose color='red' />}
        </Button>
      </td>
    </tr>
  );
};

export default Completed;
