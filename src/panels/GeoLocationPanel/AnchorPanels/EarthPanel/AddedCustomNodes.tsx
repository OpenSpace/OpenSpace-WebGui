import { ActionIcon, Box, Text } from '@mantine/core';

import { SceneGraphNodeHeader } from '@/panels/Scene/SceneGraphNode/SceneGraphNodeHeader';
import { Identifier } from '@/types/types';
import { sgnUri } from '@/util/propertyTreeHelpers';
import { useWindowSize } from '@/windowmanagement/Window/hooks';
import { MinusIcon } from '@/icons/icons';

interface Props {
  addedNodes: Identifier[];
  removeFocusNode: (identifier: Identifier) => void;
}

// This component is its own to reduce the amount of rerenders in
// EarthPanel due to the `useWindowSize()` hook
export function AddedCustomNodes({ addedNodes, removeFocusNode }: Props) {
  // TODO anden88 2025-02-07 Using the windowSize like this causes some stuttering when
  // moving the window panel. Investigation with Ylva we found that the culprit is most
  // likely the `ScrollArea` wrapping the entire window, possible solution is make own
  // scroll behaviour and instead wrap in e.g, `Box`
  const { width } = useWindowSize();
  const containerPadding = 36;
  const containerMaxWidth = 925;

  return addedNodes.length === 0 ? (
    <Text>No added nodes</Text>
  ) : (
    <Box w={width - containerPadding} maw={containerMaxWidth}>
      {addedNodes.map((identifier) => (
        <SceneGraphNodeHeader
          key={identifier}
          uri={sgnUri(identifier)}
          leftSection={
            <ActionIcon
              variant={'light'}
              size={'sm'}
              color={'red'}
              onClick={() => removeFocusNode(identifier)}
            >
              <MinusIcon />
            </ActionIcon>
          }
        />
      ))}
    </Box>
  );
}
