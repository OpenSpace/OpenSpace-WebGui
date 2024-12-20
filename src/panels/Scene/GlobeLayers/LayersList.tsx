import { useState } from 'react';
import { DragDropContext, Draggable, Droppable, DropResult } from '@hello-pangea/dnd';
import { Box, Group, ThemeIcon } from '@mantine/core';

import { useOpenSpaceApi } from '@/api/hooks';
import { DragHandleIcon } from '@/icons/icons';
import { Identifier, Uri } from '@/types/types';

import { GlobeLayer } from './GlobeLayer';

interface Props {
  globe: Identifier;
  layerGroup: Identifier;
  layers: Uri[];
}

export function LayerList({ globe, layerGroup, layers }: Props) {
  const [renderedLayersList, setRenderedLayersList] = useState(layers);

  const luaApi = useOpenSpaceApi();

  if (!renderedLayersList || renderedLayersList.length === 0) {
    return <></>;
  }

  async function onDragEnd(result: DropResult<string>) {
    if (!result.destination || result.source.index === result.destination.index) {
      // No change - do nothing
      return;
    }
    // Get new layer order
    const updatedLayers = Array.from(renderedLayersList);
    const [movedLayer] = updatedLayers.splice(result.source.index, 1);
    updatedLayers.splice(result.destination.index, 0, movedLayer);
    setRenderedLayersList(updatedLayers);
    // Call the scripting for the engine
    await luaApi?.globebrowsing.moveLayer(
      globe,
      layerGroup,
      result.source.index,
      result.destination.index
    );
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId={'layers'}>
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {renderedLayersList.map((layerUri, index) => (
              <Draggable key={layerUri} draggableId={layerUri} index={index}>
                {(item) => (
                  <Group ref={item.innerRef} gap={'xs'} {...item.draggableProps}>
                    <Box flex={1}>
                      <GlobeLayer uri={layerUri} />
                    </Box>
                    <ThemeIcon variant={'default'} {...item.dragHandleProps}>
                      <DragHandleIcon />
                    </ThemeIcon>
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
