import { BoxData, PanelData, TabData } from 'rc-dock';

import { useWindowLayoutProvider } from '@/windowmanagement/WindowLayout/hooks';

export const DefaultWindowId = 'defaultSceneGraphNodeWindow';

export function useOpenCurrentSceneNodeWindow() {
  const { ref, addWindow, closeWindow, createWindowTabData } = useWindowLayoutProvider();

  function openCurrentNodeWindow(content: JSX.Element) {
    if (!ref || !('current' in ref) || ref.current === null) {
      throw new Error('WindowLayoutProvider ref is not set');
    }

    const existingWindow = ref.current.find(DefaultWindowId);
    if (!existingWindow) {
      addWindow(content, {
        id: DefaultWindowId,
        title: 'Scene: Selected Node',
        position: 'float'
      });

      const newWindow = ref.current.find(DefaultWindowId) as TabData | PanelData;
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
      const newTabData = createWindowTabData(
        DefaultWindowId,
        'Scene: Selected Node',
        content
      );
      ref.current.updateTab(DefaultWindowId, newTabData, true);

      // @TODO (emmbr, 2024-12-04): The content is not correctly updated for float windows
      // when this is used. Figure out how to solve this, i.e. move the window to the
      // front.
      // ref.current.dockMove(existingWindow as TabData | PanelData, null, 'front');
    }
  }

  function closeCurrentNodeWindow() {
    closeWindow(DefaultWindowId);
  }

  return {
    openCurrentNodeWindow,
    closeCurrentNodeWindow
  };
}
