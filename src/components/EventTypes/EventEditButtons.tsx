import { FaEdit } from 'react-icons/fa';
import { Button } from '@/components/ui';
import AddEventType from './AddEventType';

type Props = {
  width?: string;
  toggleEditMode: () => void;
};

const EventEditButtons = ({ width = '30rem', toggleEditMode }: Props) => (
  <div className="flex gap-2 mx-auto" style={{ width }}>
    <div className="text-center border-2 rounded-lg border-dashed w-1/2">
      <AddEventType />
    </div>
    <div className="text-center border-2 rounded-lg border-dashed w-1/2">
      <Button variant="ghost" className="w-full" onClick={toggleEditMode}>
        <FaEdit />
      </Button>
    </div>
  </div>
);

export default EventEditButtons;
