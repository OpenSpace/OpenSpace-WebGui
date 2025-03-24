import { PropsWithChildren, useRef } from 'react';
import { Box, RenderTreeNodePayload } from '@mantine/core';
import { useWindowEvent } from '@mantine/hooks';

import { useAppDispatch } from '@/redux/hooks';
import { setSceneTreeSelectedNode } from '@/redux/local/localSlice';

import { isGroupNode } from './treeUtils';

type SceneTreeNodeProps = Pick<
  RenderTreeNodePayload,
  'node' | 'expanded' | 'elementProps' | 'tree'
>;

// This component adds the neccessary props for Mantine tree nodes, which includes styling
// (indentation at each tree level) and event handling
export function SceneTreeNode({
  node,
  elementProps,
  tree,
  children
}: SceneTreeNodeProps & PropsWithChildren) {
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
