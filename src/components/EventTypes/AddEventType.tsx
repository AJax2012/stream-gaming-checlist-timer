import { useState } from 'react';
import cn from 'classnames';
import { useFormik } from 'formik';
import { MdAdd } from 'react-icons/md';
import { GoAlert } from 'react-icons/go';
import { object, string, mixed, number } from 'yup';

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  Label,
} from '@/components/ui';
import { EventTypeOption } from '@/types';
import { useEvent } from '@/store';

import Completed from './Completed';
import Counter from './Counter';

const AddEventType = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { addEventType, eventTypes } = useEvent();

  const {
    handleSubmit,
    values,
    handleChange,
    handleReset,
    isValid,
    errors,
    touched,
  } = useFormik({
    initialValues: {
      label: '',
      eventTypeSelected: 'completed',
      maxCount: 0,
    },
    validationSchema: object({
      label: string().required('Required'),
      eventTypeSelected: mixed().oneOf(['counter', 'completed']).required('Required'),
      maxCount: number().notRequired(),
    }),
    onSubmit: ({ label, eventTypeSelected, maxCount }, { resetForm, setErrors }) => {
      if (eventTypes.filter((event) => event.label === label).length > 0) {
        setErrors({ label: 'Event type already exists' });
        return;
      }

      addEventType({
        label,
        type: eventTypeSelected as EventTypeOption,
        max: maxCount > 0 ? maxCount : undefined,
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
            <DialogTitle>Add Event Type</DialogTitle>
            <DialogDescription>
              Add a new event type to keep track of your gaming session.
            </DialogDescription>
          </DialogHeader>
          <fieldset name="eventTypeSelected">
            <legend className="sr-only">Event Type</legend>
            <table className="mx-auto table-auto w-auto border-separate border-spacing-x-0 border-spacing-y-2">
              <tbody>
                <Completed
                  id="add-completed"
                  label="Completed"
                  isRadioOption
                  optionSelected={values.eventTypeSelected as EventTypeOption}
                  onChange={handleChange}
                  isEditMode={false}
                />
                <Counter
                  id="add-counter"
                  label="Counter"
                  max={5}
                  isRadioOption
                  optionSelected={values.eventTypeSelected as EventTypeOption}
                  onChange={handleChange}
                  isEditMode={false}
                />
              </tbody>
            </table>
          </fieldset>
          <div className="mt-2 mb-6">
            <Label htmlFor="nameInput">Event Type Name</Label>
            <Input
              type="text"
              placeholder="Event Type Name"
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
            className={cn('mt-2 mb-6', { hidden: values.eventTypeSelected === 'completed' })}
          >
            <Label htmlFor="maxCountInput">Max Count</Label>
            <Input
              type="number"
              placeholder="Max Count"
              name="maxCount"
              id="maxCountInput"
              onChange={handleChange}
            />
          </div>
          <DialogFooter>
            <Button type="reset" onClick={handleReset} variant="destructive">
              Cancel
            </Button>
            <Button
              type="submit"
              onClick={() => handleSubmit}
              disabled={!isValid}
            >
              Add
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddEventType;
