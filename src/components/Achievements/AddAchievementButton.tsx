import { useState } from 'react';
import cn from 'classnames';
import { useFormik } from 'formik';
import { MdAdd } from 'react-icons/md';
import { GoAlert } from 'react-icons/go';
import { boolean, mixed, number, object, string } from 'yup';

import type { AchievementType } from '@/types';
import { useAchievement } from '@/store';

import Completed from './Completed';
import Counter from './Counter';
import {
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  Label,
} from '../ui';

const AddAchievementButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { addAchievement, achievements } = useAchievement();

  const { handleSubmit, values, handleChange, handleReset, errors, touched } =
    useFormik({
      initialValues: {
        label: '',
        celebrateOnCompleted: false,
        type: 'completed',
        max: 0,
      },
      validationSchema: object({
        label: string().required('Required'),
        celebrateOnCompleted: boolean().required('Required'),
        type: mixed().oneOf(['counter', 'completed']).required('Required'),
        max: number().test({
          name: 'max',
          message: 'Max must be greater than 0 when celebrating for a counter',
          test: (max, { parent }) => {
            if (
              parent.type === 'counter' &&
              parent.celebrateOnCompleted === true
            ) {
              return !!max && max > 0;
            }

            return true;
          },
        }),
      }),
      onSubmit: (
        { celebrateOnCompleted, type, label, max },
        { resetForm, setErrors }
      ) => {
        if (achievements.filter((event) => event.label === label).length > 0) {
          setErrors({ label: 'Event tracker already exists' });
          return;
        }

        addAchievement({
          label,
          type: type as AchievementType,
          max: max > 0 ? max : undefined,
          celebrateOnCompleted,
        });

        resetForm();
        setIsOpen(false);
      },
      onReset: () => {
        setIsOpen(false);
      },
    });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="w-full"
          onClick={() => setIsOpen(true)}
        >
          <MdAdd />
        </Button>
      </DialogTrigger>
      <DialogContent className="px-8">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <DialogHeader>
            <DialogTitle>Add Event Tracker</DialogTitle>
            <DialogDescription>
              Add a new event tracker to keep track of your gaming session.
            </DialogDescription>
          </DialogHeader>
          <fieldset name="type">
            <legend className="sr-only">Event Tracker</legend>
            <table className="mx-auto table-auto w-auto border-separate border-spacing-x-0 border-spacing-y-2">
              <tbody>
                <Completed
                  achievement={{
                    id: 'add-completed',
                    type: 'completed',
                    label: 'Completed',
                    celebrateOnCompleted: false,
                  }}
                  isRadioOption
                  achievementTypeSelected={values.type as AchievementType}
                  onChange={handleChange}
                  isEditMode={false}
                />
                <Counter
                  achievement={{
                    id: 'add-counter',
                    type: 'counter',
                    label: 'Counter',
                    celebrateOnCompleted: false,
                    max: 5,
                  }}
                  isRadioOption
                  achievementTypeSelected={values.type as AchievementType}
                  onChange={handleChange}
                  isEditMode={false}
                />
              </tbody>
            </table>
          </fieldset>
          <fieldset name="celebrateOnCompleted">
            <div className="mt-4 mb-4 flex items-center space-x-2">
              <Checkbox
                id="celebrateOnCompletedInput"
                name="celebrateOnCompleted"
                checked={values.celebrateOnCompleted}
                onClick={() => {
                  handleChange({
                    target: {
                      name: 'celebrateOnCompleted',
                      value: !values.celebrateOnCompleted,
                    },
                  });
                }}
              />
              <Label htmlFor="celebrateOnCompletedInput">
                Celebrate on Completion
              </Label>
            </div>
          </fieldset>
          <div className="mb-6">
            <Label htmlFor="nameInput">Label</Label>
            <Input
              type="text"
              placeholder="Label for Event Tracker"
              name="label"
              id="labelInput"
              minLength={2}
              value={values.label}
              onChange={handleChange}
              className={cn({
                'border-red-500 focus-visible:ring-0':
                  errors.label && touched.label,
              })}
            />
            {errors.label && touched.label && (
              <p className="text-red-500 text-sm flex items-center">
                <GoAlert className="mr-1" />
                {errors.label}
              </p>
            )}
          </div>
          <div
            className={cn('mt-2 mb-6', {
              hidden: values.type === 'completed',
            })}
          >
            <Label htmlFor="maxInput">Max Count</Label>
            <Input
              type="number"
              placeholder="Max Count"
              name="max"
              id="maxInput"
              onChange={handleChange}
            />
            {errors.max && touched.max && (
              <p className="text-red-500 text-sm flex items-center">
                <GoAlert className="mr-1" />
                {errors.max}
              </p>
            )}
          </div>
          <DialogFooter>
            <Button type="reset" onClick={handleReset} variant="destructive">
              Cancel
            </Button>
            <Button type="submit" onClick={() => handleSubmit}>
              Add
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddAchievementButton;
