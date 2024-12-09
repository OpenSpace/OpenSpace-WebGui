import { useState } from 'react';
import { DragDropContext, Draggable, Droppable, DropResult } from '@hello-pangea/dnd';

import { useOpenSpaceApi } from '@/api/hooks';

import { GlobeLayer } from './GlobeLayer';

interface Props {
  layers: string[]; // List of URIs
  globe: string;
  layerGroup: string;
}

export function LayerList({ layers, globe, layerGroup }: Props) {
  const [renderedLayersList, setRenderedLayersList] = useState(layers);

  const luaApi = useOpenSpaceApi();

  if (!renderedLayersList || renderedLayersList.length === 0) {
    return null;
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
                  <div ref={item.innerRef} {...item.draggableProps}>
                    <GlobeLayer
                      uri={layerUri}
                      showDragHandle={renderedLayersList.length > 1}
                      dragHandleProps={item.dragHandleProps}
                    />
                  </div>
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
