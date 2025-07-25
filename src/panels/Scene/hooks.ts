import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { BoxData, PanelData, TabData } from 'rc-dock';

import { useProperty } from '@/hooks/properties';
import { usePropertyOwner } from '@/hooks/propertyOwner';
import { Uri } from '@/types/types';
import { useWindowLayoutProvider } from '@/windowmanagement/WindowLayout/hooks';

export const DefaultSgnWindowId = 'defaultSceneGraphNodeWindow';

export function useOpenCurrentSceneNodeWindow() {
  const { t } = useTranslation('panel-scene', { keyPrefix: 'hooks' });
  const { ref, addWindow, closeWindow, createWindowTabData } = useWindowLayoutProvider();

  function openCurrentNodeWindow(content: React.ReactNode) {
    if (!ref || ref.current === null) {
      throw new Error('WindowLayoutProvider ref is not set');
    }

    const existingWindow = ref.current.find(DefaultSgnWindowId);
    if (!existingWindow) {
      addWindow(content, {
        id: DefaultSgnWindowId,
        title: t('selected-node-window-title'),
        position: 'float'
      });

      const newWindow = ref.current.find(DefaultSgnWindowId) as TabData | PanelData;
      const scenePanelParentBox = ref.current.find('scene')?.parent as BoxData;

      if (!newWindow || !scenePanelParentBox) {
        throw new Error('Could not find the new window or the scene panel parent box');
      }

      const isFloatingWindow = scenePanelParentBox.parent?.mode === 'float';
      if (!isFloatingWindow) {
        // Split the current Layout, and dock the new window to the bottom
        ref.current.dockMove(newWindow, scenePanelParentBox, 'bottom');
      }
    } else {
      const newTabData = createWindowTabData(
        DefaultSgnWindowId,
        t('selected-node-window-title'),
        content
      );
      ref.current.updateTab(DefaultSgnWindowId, newTabData, true);

      // @TODO (emmbr, 2024-12-04): The content is not correctly updated for float windows
      // when this is used (trying to make the window move to the front). Figure out how
      // to solve this
      // ref.current.dockMove(existingWindow as TabData | PanelData, null, 'front');
    }
  }

  const closeCurrentNodeWindow = useCallback(() => {
    closeWindow(DefaultSgnWindowId);
  }, [closeWindow]);

  return {
    openCurrentNodeWindow,
    closeCurrentNodeWindow
  };
}

export function useTimeFrame(uri: Uri) {
  const timeFrame = usePropertyOwner(`${uri}.TimeFrame`);
  const [isInTimeFrame] = useProperty('BoolProperty', `${uri}.TimeFrame.IsInTimeFrame`);

  return {
    timeFrame,
    isInTimeFrame
  };
}
