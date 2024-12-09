import { Box, RenderTreeNodePayload, TreeNodeData } from '@mantine/core';

import { CollapsableHeader } from '../../../components/CollapsableHeader/CollapsableHeader';
import { useOpenCurrentSceneNodeWindow } from '../hooks';
import { SceneGraphNodeHeader } from '../SceneGraphNode/SceneGraphNodeHeader';
import { SceneGraphNodeView } from '../SceneGraphNode/SceneGraphNodeView';

import { isGroupNode } from './treeUtil';

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
