import { useEffect, useState } from 'react';
import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import { useAchievement, useSettings, useTimer } from '@/store';
import { Card, CardContent, CardHeader, CardTitle } from './ui';
import { Counter, Completed, EditAchievementButtons } from './Achievements';
import { colord } from 'colord';

const AchievementList = () => {
  const [isEditMode, setIsEditMode] = useState(true);
  const { achievements, reorderAchievements } = useAchievement();
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
      const oldIndex = achievements.findIndex(
        (event) => event.id === active.id
      );
      const newIndex = achievements.findIndex((event) => event.id === over.id);

      reorderAchievements(oldIndex, newIndex);
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

  return (
    <Card
      className="mx-auto max-w-2xl"
      style={{
        backgroundColor: colord(cardColor).toRgbString(),
      }}
    >
      <CardHeader>
        <CardTitle>Achievements</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="sm:container mx-auto">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={achievements}
              strategy={verticalListSortingStrategy}
            >
              <table className="mx-auto table-auto w-auto border-separate border-spacing-x-0 border-spacing-y-2">
                <tbody>
                  {achievements.map((event) =>
                    event.type === 'counter' ? (
                      <Counter
                        key={event.id}
                        achievement={event}
                        isEditMode={isEditMode}
                      />
                    ) : (
                      event.type === 'completed' && (
                        <Completed
                          key={event.id}
                          achievement={event}
                          isEditMode={isEditMode}
                        />
                      )
                    )
                  )}
                  {(!isActive || isPaused) && (
                    <EditAchievementButtons
                      isEditMode={isEditMode}
                      toggleEditMode={toggleEditMode}
                    />
                  )}
                </tbody>
              </table>
            </SortableContext>
          </DndContext>
        </div>
      </CardContent>
    </Card>
  );
};

export default AchievementList;
