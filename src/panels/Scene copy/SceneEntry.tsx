import { Box, Group } from '@mantine/core';

import { CollapsableHeader } from '@/components/Collapsable/CollapsableHeader/CollapsableHeader';

import { SceneGraphNodeHeader } from './SceneGraphNode/SceneGraphNodeHeader';
import { isGroupNode } from './SceneTree/treeUtils';
import { SceneTreeNodeData } from './SceneTree/types';

interface Props {
  node: SceneTreeNodeData;
  expanded: boolean;
  onClick: () => void;
  isCurrentNode: boolean;
  className?: string;
}

// This component adds the content for each node in the tree, without any styling. Used
// to render the content for the leaf nodes when searching for a node
export function SceneEntry({ node, expanded, isCurrentNode, onClick, className }: Props) {
  // @TODO: Make the text in this component look more clickable, e.g. using hover effects
  return isGroupNode(node) ? (
    <Box>
      <CollapsableHeader expanded={expanded} title={node.label} />
    </Box>
  ) : (
    <Group
      px={'xs'}
      py={2}
      style={
        isCurrentNode
          ? {
              borderLeft: '3px solid var(--mantine-primary-color-filled)',
              backgroundColor: 'var(--mantine-color-dark-7)'
            }
          : undefined
      }
      className={className}
      wrap={'nowrap'}
      gap={'xs'}
      grow
      preventGrowOverflow={false}
    >
      <SceneGraphNodeHeader
        uri={node.value}
        label={node.label as string}
        onClick={onClick}
      />
    </Group>
  );
}
