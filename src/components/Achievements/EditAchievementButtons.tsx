import { FaEdit } from 'react-icons/fa';
import AddAchievementButton from './AddAchievementButton';
import { Button } from '../ui';

type Props = {
  isEditMode: boolean;
  toggleEditMode: () => void;
};

const EditAchievementButtons = ({ isEditMode, toggleEditMode }: Props) => (
  <tr>
    <td colSpan={isEditMode ? 4 : 2}>
      <div className="flex gap-2 mx-auto">
        <div className="text-center border-2 rounded-lg border-dashed w-1/2">
          <AddAchievementButton />
        </div>
        <div className="text-center border-2 rounded-lg border-dashed w-1/2">
          <Button variant="ghost" className="w-full" onClick={toggleEditMode}>
            <FaEdit />
          </Button>
        </div>
      </div>
    </td>
  </tr>
);

export default EditAchievementButtons;
