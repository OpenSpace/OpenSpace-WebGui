import { ActionIcon, Text } from '@mantine/core';

import { MinusIcon } from '@/icons/icons';
import { SceneGraphNodeHeader } from '@/panels/Scene/SceneGraphNode/SceneGraphNodeHeader';
import { Identifier } from '@/types/types';
import { sgnUri } from '@/util/propertyTreeHelpers';

interface Props {
  addedNodes: Identifier[];
  removeFocusNode: (identifier: Identifier) => void;
}

export function AddedCustomNodes({ addedNodes, removeFocusNode }: Props) {
  return addedNodes.length === 0 ? (
    <Text>No added nodes</Text>
  ) : (
    <>
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
    </>
  );
}
