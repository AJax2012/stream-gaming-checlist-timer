import { useEffect, useState } from 'react';
import cn from 'classnames';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { FaEdit } from 'react-icons/fa';
import { useEvent, useSettings, useTimer } from '@/store';
import { Button, Card } from './ui';
import { AddEventType, Counter, Completed } from './EventTypes';

const EventTypesContainer = () => {
  const [isEditMode, setIsEditMode] = useState(true);
  const { eventTypes, reorderEventTypes } = useEvent();
  const { isActive, isPaused } = useTimer();
  const { cardColor } = useSettings();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (over?.id && active.id !== over?.id) {
      const oldIndex = eventTypes.findIndex((event) => event.id === active.id);
      const newIndex = eventTypes.findIndex((event) => event.id === over.id);

      reorderEventTypes(oldIndex, newIndex);
    }
  };

  useEffect(() => {
    if (isActive && !isPaused) {
      setIsEditMode(false);
    }
  }, [isActive, isPaused]);

  return (
    <Card
      className="mx-auto max-w-2xl p-12 my-4"
      style={{
        backgroundColor: `rgba(${cardColor.r}, ${cardColor.g}, ${cardColor.b}, ${cardColor.a})`,
      }}
    >
      <div className="container mx-auto">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={eventTypes}
            strategy={verticalListSortingStrategy}
          >
            <table className="mx-auto table-auto w-auto border-separate border-spacing-x-0 border-spacing-y-2">
              <tbody>
                {eventTypes.map((event) =>
                  event.type === 'counter' ? (
                    <Counter
                      key={event.id}
                      id={event.id}
                      max={event.max}
                      label={event.label}
                      isEditMode={isEditMode}
                    />
                  ) : (
                    event.type === 'completed' && (
                      <Completed
                        key={event.id}
                        id={event.id}
                        label={event.label}
                        isEditMode={isEditMode}
                      />
                    )
                  )
                )}
              </tbody>
            </table>
            {(!isActive || isPaused) && (
              <div
                className={cn('flex gap-2 mx-auto', {
                  'max-w-[30rem]': isEditMode,
                  'max-w-[21.5rem]': !isEditMode,
                })}
              >
                <div className="text-center border-2 rounded-lg border-dashed w-1/2">
                  <AddEventType />
                </div>
                <div className="text-center border-2 rounded-lg border-dashed w-1/2">
                  <Button
                    variant="ghost"
                    className="w-full"
                    onClick={() => setIsEditMode(!isEditMode)}
                  >
                    <FaEdit />
                  </Button>
                </div>
              </div>
            )}
          </SortableContext>
        </DndContext>
      </div>
    </Card>
  );
};

export default EventTypesContainer;
