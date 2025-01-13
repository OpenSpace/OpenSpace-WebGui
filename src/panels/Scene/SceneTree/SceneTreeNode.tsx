import { Box, RenderTreeNodePayload, TreeNodeData } from '@mantine/core';

import { CollapsableHeader } from '@/components/Collapse/CollapsableHeader/CollapsableHeader';
import { isGroupNode } from '@/util/sceneTreeGroupsHelper';

import { useOpenCurrentSceneNodeWindow } from '../hooks';
import { SceneGraphNodeHeader } from '../SceneGraphNode/SceneGraphNodeHeader';
import { SceneGraphNodeView } from '../SceneGraphNode/SceneGraphNodeView';

interface Props {
  node: TreeNodeData;
  expanded: boolean;
}

// @TODO: Make the text in this component look more clickable, e.g. using hover effects
export function SceneTreeNode({ node, expanded }: Props) {
  const { openCurrentNodeWindow } = useOpenCurrentSceneNodeWindow();

  return isGroupNode(node) ? (
    <CollapsableHeader expanded={expanded} text={node.label} />
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

// This component is a wrapper around the SceneTreeNode component that adds the styling
// that the Mantine Tree component uses for its nodes, such as the indentation at each
// tree level.
//
// The reason it is split up into two components (one styled and one not) is that there
// are cases when we want to render the nodes the tree-specic styling, e.g. when searching
export function SceneTreeNodeStyled({
  node,
  expanded,
  elementProps
}: RenderTreeNodePayload) {
  return (
    <Box {...elementProps}>
      <SceneTreeNode node={node} expanded={expanded} />
    </Box>
  );
}
