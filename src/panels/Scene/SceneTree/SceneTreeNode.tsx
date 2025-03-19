import { useRef } from 'react';
import { Box, RenderTreeNodePayload } from '@mantine/core';
import { useWindowEvent } from '@mantine/hooks';

import { CollapsableHeader } from '@/components/Collapsable/CollapsableHeader/CollapsableHeader';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setSceneTreeSelectedNode } from '@/redux/local/localSlice';

import { useOpenCurrentSceneNodeWindow } from '../hooks';
import { SceneGraphNodeHeader } from '../SceneGraphNode/SceneGraphNodeHeader';

import { CurrentNodeView } from './CurrentNodeView';
import { isGroupNode } from './treeUtils';
import { SceneTreeNodeData } from './types';

interface Props {
  node: SceneTreeNodeData;
  expanded: boolean;
}

// This component adds the content for each node in the tree, without any styling. Used
// to render the content for the leaf nodes when searching for a node
export function SceneTreeNodeContent({ node, expanded }: Props) {
  const { openCurrentNodeWindow } = useOpenCurrentSceneNodeWindow();
  const dispatch = useAppDispatch();

  const isCurrentNode = useAppSelector(
    (state) => node.value === state.local.sceneTree.currentlySelectedNode
  );

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
    >
      <SceneGraphNodeHeader
        uri={node.value}
        label={node.label as string}
        onClick={() => {
          dispatch(setSceneTreeSelectedNode(node.value));
          openCurrentNodeWindow(<CurrentNodeView />);
        }}
      />
    </Box>
  );
}

// This component adds the neccessary props for Mantine tree nodes, which includes styling
// (indentation at each tree level) and event handling
export function SceneTreeNode({
  node,
  expanded,
  elementProps,
  tree
}: RenderTreeNodePayload) {
  const { openCurrentNodeWindow } = useOpenCurrentSceneNodeWindow();
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
        openCurrentNodeWindow(<CurrentNodeView />);
      }
    }
  });

  return (
    <Box {...elementProps} ref={nodeRef}>
      <SceneTreeNodeContent node={node} expanded={expanded} />
    </Box>
  );
}
