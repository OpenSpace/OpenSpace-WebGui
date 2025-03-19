import { PropsWithChildren, useRef } from 'react';
import { Box, RenderTreeNodePayload } from '@mantine/core';
import { useWindowEvent } from '@mantine/hooks';

import { CollapsableHeader } from '@/components/Collapsable/CollapsableHeader/CollapsableHeader';
import { useAppDispatch } from '@/redux/hooks';
import { setSceneTreeSelectedNode } from '@/redux/local/localSlice';

import { SceneGraphNodeHeader } from '../SceneGraphNode/SceneGraphNodeHeader';

import { isGroupNode } from './treeUtils';
import { SceneTreeNodeData } from './types';

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
    <Box
      px={'xs'}
      py={2}
      bd={isCurrentNode ? '3px solid var(--mantine-primary-color-filled)' : 'none'}
      className={className}
    >
      <SceneGraphNodeHeader
        uri={node.value}
        label={node.label as string}
        onClick={onClick}
      />
    </Box>
  );
}

// This component adds the neccessary props for Mantine tree nodes, which includes styling
// (indentation at each tree level) and event handling
export function SceneTreeNode({
  node,
  elementProps,
  tree,
  children
}: RenderTreeNodePayload & PropsWithChildren) {
  const dispatch = useAppDispatch();

  const nodeRef = useRef<HTMLDivElement>(null);

  // Open the node in the current node window when the user presses Enter on the node
  useWindowEvent('keydown', (event) => {
    const parentElement = nodeRef?.current?.parentElement;
    const isFocused = parentElement && parentElement === document.activeElement;
    if (event.key === 'Enter' && isFocused) {
      if (isGroupNode(node)) {
        tree.toggleExpanded(node.value);
      } else {
        dispatch(setSceneTreeSelectedNode(node.value));
      }
    }
  });

  return (
    <Box {...elementProps} ref={nodeRef}>
      {children}
    </Box>
  );
}
