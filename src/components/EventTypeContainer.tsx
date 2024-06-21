import { useEffect, useRef, useState } from 'react';
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

import { useEvent, useSettings, useTimer } from '@/store';
import { Card } from './ui';
import { Counter, Completed, EventEditButtons } from './EventTypes';

const defaultWidth = 510;

const EventTypesContainer = () => {
  const tableRef = useRef<HTMLTableElement>(null);
  const [isEditMode, setIsEditMode] = useState(true);
  const [tableWidth, setTableWidth] = useState<number>();
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

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  useEffect(() => {
    if (isActive && !isPaused) {
      setIsEditMode(false);
    }
  }, [isActive, isPaused]);

  useEffect(
    () => {
      let interval: NodeJS.Timeout | undefined = undefined;

      if (eventTypes.length === 0) {
        setTableWidth(defaultWidth);
        return;
      }

      if (!isActive || isPaused || !tableRef.current?.clientWidth) {
        interval = setInterval(() => {
          if (tableRef.current?.clientWidth !== tableWidth) {
            setTableWidth(tableRef.current?.clientWidth);
          }
        }, 10);
      } else {
        clearInterval(interval);
      }

      return () => clearInterval(interval);
    },
    [eventTypes, isActive, isPaused, tableRef.current?.clientWidth]
  );

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
            <table ref={tableRef} className="mx-auto table-auto w-auto border-separate border-spacing-x-0 border-spacing-y-2">
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
              <EventEditButtons
                width={`${tableWidth ?? defaultWidth}px`}
                toggleEditMode={toggleEditMode}
              />
            )}
          </SortableContext>
        </DndContext>
      </div>
    </Card>
  );
};

export default EventTypesContainer;
