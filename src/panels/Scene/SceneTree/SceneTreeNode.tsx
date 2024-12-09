import { Box, RenderTreeNodePayload, TreeNodeData } from '@mantine/core';
import { BoxData, PanelData, TabData } from 'rc-dock';

import { useWindowLayoutProvider } from '@/windowmanagement/WindowLayout/hooks';
import { createTabData } from '@/windowmanagement/WindowLayout/WindowLayoutProvider';

import { CollapsableHeader } from '../../../components/CollapsableHeader/CollapsableHeader';
import { SceneGraphNodeHeader } from '../SceneGraphNode/SceneGraphNodeHeader';
import { SceneGraphNodeView } from '../SceneGraphNode/SceneGraphNodeView';

import { isGroup } from './treeUtil';

interface Props {
  node: TreeNodeData;
  expanded: boolean;
}

// @TODO: Make the text in this component look more clickable, e.g. using hover effects
export function SceneTreeNode({ node, expanded }: Props) {
  const { ref, addWindow } = useWindowLayoutProvider();

  const defaultWindowId = 'defaultSceneGraphNodeWindow';

  function openSceneGraphNodeWindow(uri: string) {
    if (!ref || !('current' in ref) || ref.current === null) {
      throw new Error('WindowLayoutProvider ref is not set');
    }

    const content = <SceneGraphNodeView uri={uri} />;

    const existingWindow = ref.current.find(defaultWindowId);
    if (!existingWindow) {
      addWindow(content, {
        id: defaultWindowId,
        title: 'Scene: Selected Node',
        position: 'float'
      });

      const newWindow = ref.current.find(defaultWindowId) as TabData | PanelData;
      const scenePanelParentBox = ref.current.find('scene')?.parent as BoxData;

      if (!newWindow || !scenePanelParentBox) {
        throw new Error('Could not find the new window or the scene panel parent box');
      }

      if (scenePanelParentBox.parent && scenePanelParentBox.parent.mode === 'float') {
        // @TODO (emmbr, 2024-12-04): If floating window, split the scene tree in two
        // instead?
      } else {
        // split the current Layout
        ref.current.dockMove(newWindow, scenePanelParentBox, 'bottom');
      }
    } else {
      const newTabData = createTabData(defaultWindowId, 'Scene: Selected Node', content);
      ref.current.updateTab(defaultWindowId, newTabData, true);

      // @TODO (emmbr, 2024-12-04): The content is not correctly updated for float windows
      // when this is used. Figure out how to solve this, i.e. move the window to the
      // front.
      // ref.current.dockMove(existingWindow as TabData | PanelData, null, 'front');
    }
  }

  return isGroup(node) ? (
    <CollapsableHeader expanded={expanded} text={node.label} />
  ) : (
    <Box ml={'xs'} mt={5}>
      <SceneGraphNodeHeader
        uri={node.value}
        label={node.label as string}
        onClick={() => openSceneGraphNodeWindow(node.value)}
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
