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
import { useEvent } from '@/store';
import { Card } from './ui';
import { Counter, Completed } from './EventTypes';
import AddEventType from './EventTypes/AddEventType';

const EventTypesContainer = () => {
  const { eventTypes, reorderEventTypes } = useEvent();

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

  return (
    <Card className="my-4 p-12 mx-60">
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
                    />
                  ) : (
                    event.type === 'completed' && (
                      <Completed
                        key={event.id}
                        id={event.id}
                        label={event.label}
                      />
                    )
                  )
                )}
                <AddEventType />
              </tbody>
            </table>
          </SortableContext>
        </DndContext>
      </div>
    </Card>
  );
};

export default EventTypesContainer;
