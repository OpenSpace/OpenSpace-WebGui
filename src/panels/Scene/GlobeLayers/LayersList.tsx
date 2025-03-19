import { Box } from '@mantine/core';

import { useOpenSpaceApi } from '@/api/hooks';
import {
  DragReorderList,
  OnDragEndProps
} from '@/components/DragReorderList/DragReorderList';
import { Identifier, Uri } from '@/types/types';

import { GlobeLayer } from './GlobeLayer';

interface Props {
  globe: Identifier;
  layerGroup: Identifier;
  layers: Uri[];
}

export function LayerList({ globe, layerGroup, layers }: Props) {
  const luaApi = useOpenSpaceApi();

  function onDragEnd({ oldIndex, newIndex }: OnDragEndProps<Uri>) {
    // Call the scripting for the engine
    luaApi?.globebrowsing.moveLayer(globe, layerGroup, oldIndex, newIndex);
  }

  return (
    <DragReorderList
      onDragEnd={onDragEnd}
      renderFunc={(id) => (
        <Box flex={1}>
          <GlobeLayer uri={id} />
        </Box>
      )}
      data={layers}
      keyFunc={(id) => id}
      id={`${globe}${layerGroup}`}
      dragHandlePosition={"right"}
    />
  );
}
