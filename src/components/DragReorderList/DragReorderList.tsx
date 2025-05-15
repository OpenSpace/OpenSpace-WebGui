import { useTranslation } from 'react-i18next';
import { DragDropContext, Draggable, Droppable, DropResult } from '@hello-pangea/dnd';
import { ActionIcon, Box, Group, MantineSpacing } from '@mantine/core';

import { usePropListeningState } from '@/hooks/util';
import { DragHandleIcon } from '@/icons/icons';

export interface OnDragEndProps<T> {
  oldIndex: number;
  newIndex: number;
  updatedData: T[];
  id: string;
}

interface Props<T> {
  onDragEnd: ({ oldIndex, newIndex, updatedData }: OnDragEndProps<T>) => void;
  renderFunc: (item: T, i: number) => React.ReactNode;
  data: T[];
  keyFunc: (item: T) => string;
  id: string;
  dragHandlePosition?: 'left' | 'right';
  gap?: MantineSpacing;
}

export function DragReorderList<T>({
  id,
  onDragEnd,
  data,
  renderFunc,
  keyFunc,
  dragHandlePosition = 'left',
  gap = 'xs'
}: Props<T>) {
  const { value: localCache, setValue: setLocalCache } = usePropListeningState(data);
  const { t } = useTranslation('components', { keyPrefix: 'drag-reorder-list' });

  async function handleDragEnd(result: DropResult<string>) {
    if (!result.destination || result.source.index === result.destination.index) {
      // No change - do nothing
      return;
    }
    // Deep copy the old array
    const updatedData = [...localCache];
    // Create the new data list
    const [movedItem] = updatedData.splice(result.source.index, 1);
    updatedData.splice(result.destination.index, 0, movedItem);
    onDragEnd({
      oldIndex: result.source.index,
      newIndex: result.destination.index,
      updatedData: updatedData,
      id: result.draggableId
    });
    setLocalCache(updatedData);
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId={id}>
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {localCache.map((element, i) => (
              <Draggable key={keyFunc(element)} draggableId={keyFunc(element)} index={i}>
                {(item) => (
                  <Group
                    ref={item.innerRef}
                    {...item.draggableProps}
                    wrap={'nowrap'}
                    mb={gap}
                  >
                    {dragHandlePosition === 'right' && (
                      <Box flex={1}>{renderFunc(element, i)}</Box>
                    )}
                    <ActionIcon
                      style={{ cursor: 'grab' }}
                      {...item.dragHandleProps}
                      aria-label={t('drag-handle-aria-label')}
                    >
                      <DragHandleIcon />
                    </ActionIcon>
                    {dragHandlePosition === 'left' && (
                      <Box flex={1}>{renderFunc(element, i)}</Box>
                    )}
                  </Group>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
