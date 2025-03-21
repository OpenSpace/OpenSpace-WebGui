import React, { useCallback } from 'react';
import { BoxData, PanelData, TabData } from 'rc-dock';

import { useOpenSpaceApi } from '@/api/hooks';
import { useBoolProperty, useFloatProperty } from '@/hooks/properties';
import { Uri } from '@/types/types';
import {
  checkVisiblity,
  enabledPropertyUri,
  fadePropertyUri
} from '@/util/propertyTreeHelpers';
import { useWindowLayoutProvider } from '@/windowmanagement/WindowLayout/hooks';

export const DefaultSgnWindowId = 'defaultSceneGraphNodeWindow';

export function useOpenCurrentSceneNodeWindow() {
  const { ref, addWindow, closeWindow, createWindowTabData } = useWindowLayoutProvider();

  function openCurrentNodeWindow(content: React.JSX.Element) {
    if (!ref || ref.current === null) {
      throw new Error('WindowLayoutProvider ref is not set');
    }

    const existingWindow = ref.current.find(DefaultSgnWindowId);
    if (!existingWindow) {
      addWindow(content, {
        id: DefaultSgnWindowId,
        title: 'Scene: Selected Node',
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
        'Scene: Selected Node',
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

export function usePropertyOwnerVisibility(uri: Uri) {
  const luaApi = useOpenSpaceApi();

  const [enabledPropertyValue, setEnabledProperty] = useBoolProperty(
    enabledPropertyUri(uri)
  );
  const [fadePropertyValue] = useFloatProperty(fadePropertyUri(uri));
  const isFadeable = fadePropertyValue !== undefined;

  const isVisible = checkVisiblity(enabledPropertyValue, fadePropertyValue);

  function setVisiblity(shouldShow: boolean, isImmediate: boolean = false) {
    const fadeTime = isImmediate ? 0 : undefined;
    if (!isFadeable) {
      setEnabledProperty(shouldShow);
    } else if (shouldShow) {
      luaApi?.fadeIn(uri, fadeTime);
    } else {
      luaApi?.fadeOut(uri, fadeTime);
    }
  }

  return {
    isVisible,
    setVisiblity
  };
}
