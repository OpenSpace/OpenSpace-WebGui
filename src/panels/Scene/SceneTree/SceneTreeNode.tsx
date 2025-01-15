import { useRef } from 'react';
import { Box, RenderTreeNodePayload, TreeNodeData } from '@mantine/core';
import { useWindowEvent } from '@mantine/hooks';

import { CollapsableHeader } from '@/components/Collapsable/CollapsableHeader/CollapsableHeader';
import { isGroupNode } from '@/util/sceneTreeGroupsHelper';

import { useOpenCurrentSceneNodeWindow } from '../hooks';
import { SceneGraphNodeHeader } from '../SceneGraphNode/SceneGraphNodeHeader';
import { SceneGraphNodeView } from '../SceneGraphNode/SceneGraphNodeView';

interface Props {
  node: TreeNodeData;
  expanded: boolean;
}

// This component adds the content for each node in the tree, without any styling. Used
// to render the content for the leaf nodes when searching for a node
export function SceneTreeNodeContent({ node, expanded }: Props) {
  const { openCurrentNodeWindow } = useOpenCurrentSceneNodeWindow();

  // @TODO: Make the text in this component look more clickable, e.g. using hover effects
  return isGroupNode(node) ? (
    <CollapsableHeader expanded={expanded} title={node.label} />
  ) : (
    <Box ml={'xs'} mt={5}>
      <SceneGraphNodeHeader
        uri={node.value}
        label={node.label as string}
        onClick={() => openCurrentNodeWindow(<SceneGraphNodeView uri={node.value} />)}
      />
    </Box>
  );
}

// This component adds the neccessary props for Mantine tree nodes, which includes styling
// (indentation at each tree level) and event handling
export function SceneTreeNode({ node, expanded, elementProps }: RenderTreeNodePayload) {
  const { openCurrentNodeWindow } = useOpenCurrentSceneNodeWindow();

  const nodeRef = useRef<HTMLDivElement>(null);

  // Open the node in the current node window when the user presses Enter on the node
  useWindowEvent('keydown', (event) => {
    const parentElement = nodeRef?.current?.parentElement;
    const isFocused = parentElement && parentElement === document.activeElement;

    if (event.code === 'Enter' && !isGroupNode(node) && isFocused) {
      openCurrentNodeWindow(<SceneGraphNodeView uri={node.value} />);
    }
  });

  return (
    <Box {...elementProps} ref={nodeRef}>
      <SceneTreeNodeContent node={node} expanded={expanded} />
    </Box>
  );
}
