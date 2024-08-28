import cn from 'classnames';
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
        <div className={cn("text-center border-2 rounded-lg w-1/2", {"border": isEditMode, "border-dashed": !isEditMode})}>
          <Button variant="ghost" className={cn("w-full", {"bg-gray-300 hover:bg-gray-300": isEditMode})} onClick={toggleEditMode}>
            <FaEdit />
          </Button>
        </div>
      </div>
    </td>
  </tr>
);

export default EditAchievementButtons;
