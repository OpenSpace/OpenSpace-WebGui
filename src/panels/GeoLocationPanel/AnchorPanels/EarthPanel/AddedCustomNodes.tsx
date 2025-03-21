import { ActionIcon, Group, Text } from '@mantine/core';

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
        <Group key={identifier} wrap={'nowrap'} grow preventGrowOverflow={false}>
          <ActionIcon
            variant={'light'}
            size={'sm'}
            color={'red'}
            flex={0}
            onClick={() => removeFocusNode(identifier)}
          >
            <MinusIcon />
          </ActionIcon>
          <SceneGraphNodeHeader uri={sgnUri(identifier)} />
        </Group>
      ))}
    </>
  );
}
