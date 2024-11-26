import { Button, RenderTreeNodePayload, TreeNodeData } from '@mantine/core';
import { BoxData, PanelData, TabData } from 'rc-dock';

import { useWindowManagerProvider } from '@/windowmanagement/WindowLayout/WindowLayoutProvider';

import { CollapsableHeader } from '../../../components/CollapsableHeader/CollapsableHeader';

import { isGroup } from './treeUtil';

interface GroupHeaderProps {
  expanded: boolean;
  node: TreeNodeData;
}

export function GroupHeader({ expanded, node }: GroupHeaderProps) {
  return <CollapsableHeader expanded={expanded} text={node.label} />;
}

interface PropertyOwnerHeaderProps {
  node: TreeNodeData;
}

export function SceneGraphNodeHeader({ node }: PropertyOwnerHeaderProps) {
  // TODO: Implement how this should look like. Sould be clear that it's clickable
  const { ref, addWindow } = useWindowManagerProvider();

  const defaultWindowId = 'defaultSceneGraphNodeWindow';

  function openSceneGraphNode() {
    if (!ref || !('current' in ref) || ref.current === null) {
      return;
    }

    const content = <div>TODO: Implement Scene Graph Node. {node.value}</div>;
    const title = 'SGN: ' + node.label;

    const existingWindow = ref.current.find(defaultWindowId);
    if (!existingWindow) {
      addWindow(content, {
        id: defaultWindowId,
        title: title,
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
      const prevData = { ...existingWindow } as TabData;
      prevData.content = content;
      prevData.title = title;
      ref.current.updateTab(defaultWindowId, prevData, true);
      ref.current.dockMove(existingWindow as TabData | PanelData, null, 'front');
    }
  }

  return (
    <Button variant={'subtle'} onClick={openSceneGraphNode}>
      {node.label}
    </Button>
  );
}

export function SceneTreeNode({ node, expanded, elementProps }: RenderTreeNodePayload) {
  return (
    <div {...elementProps}>
      {isGroup(node) ? (
        <GroupHeader expanded={expanded} node={node} />
      ) : (
        <SceneGraphNodeHeader node={node} />
      )}
    </div>
  );
}
