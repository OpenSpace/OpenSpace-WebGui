import { Box, RenderTreeNodePayload } from '@mantine/core';
import { BoxData, PanelData, TabData } from 'rc-dock';

import {
  createTabData,
  useWindowManagerProvider
} from '@/windowmanagement/WindowLayout/WindowLayoutProvider';

import { CollapsableHeader } from '../../../components/CollapsableHeader/CollapsableHeader';
import { SceneGraphNode } from '../SceneGraphNode/SceneGraphNode';
import { SceneGraphNodeHeader } from '../SceneGraphNode/SceneGraphNodeHeader';

import { isGroup } from './treeUtil';

export function SceneTreeNode({ node, expanded, elementProps }: RenderTreeNodePayload) {
  // TODO: Implement how this should look like. Sould be clear that it's clickable
  const { ref, addWindow } = useWindowManagerProvider();

  const defaultWindowId = 'defaultSceneGraphNodeWindow';

  function openSceneGraphNodeWindow(uri: string) {
    if (!ref || !('current' in ref) || ref.current === null) {
      return;
    }

    const content = <SceneGraphNode uri={uri} />;

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
        return;
      }

      if (scenePanelParentBox.parent && scenePanelParentBox.parent.mode === 'float') {
        // TODO: If floating window, split the scene tree in two instead
      } else {
        // split the curent Layout
        ref.current.dockMove(newWindow, scenePanelParentBox, 'bottom');
      }
    } else {
      const newTabData = createTabData(defaultWindowId, 'Scene: Selected Node', content);
      ref.current.updateTab(defaultWindowId, newTabData, true);

      // TODO: The content is not correctly updated for float windows when this is used
      // ref.current.dockMove(existingWindow as TabData | PanelData, null, 'front');
    }
  }

  return (
    <div {...elementProps}>
      {isGroup(node) ? (
        <CollapsableHeader expanded={expanded} text={node.label} />
      ) : (
        <Box mx={'xs'}>
          <SceneGraphNodeHeader
            uri={node.value}
            label={node.label as string}
            onClick={() => openSceneGraphNodeWindow(node.value)}
          />
        </Box>
      )}
    </div>
  );
}
