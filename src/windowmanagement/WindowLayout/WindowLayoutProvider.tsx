import React, { useCallback, useRef } from 'react';
import { Title } from '@mantine/core';
import DockLayout, { BoxData, PanelData, TabData } from 'rc-dock';

import { useAppDispatch } from '@/redux/hooks';
import { setMenuItemOpen } from '@/redux/local/localSlice';
import { Window } from '@/windowmanagement/Window/Window';

import { FloatWindowPosition, WindowLayoutOptions } from './types';
import { WindowLayoutContext } from './WindowLayoutContext';

export function WindowLayoutProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const rcDocRef = useRef<DockLayout>(null);

  function isPanelDataInstance(obj: PanelData | BoxData) {
    return obj && 'tabs' in obj;
  }

  function convertFloatPosition(pos?: FloatWindowPosition) {
    if (!pos) {
      return undefined;
    }
    return {
      top: window.innerHeight - pos.height - pos.offsetY,
      height: pos.height,
      left: pos.offsetX,
      width: pos.width
    };
  }

  const createWindowTabData = useCallback(
    (id: string, title: string, content: React.ReactNode): TabData => {
      return {
        id,
        title: (
          <Title order={1} size={'md'} pr={3} fw={500}>
            {title}
          </Title>
        ),
        content: <Window>{content}</Window>,
        cached: true,
        closable: true,
        group: 'card regularWindow',
        minWidth: 150,
        minHeight: 50
      };
    },
    []
  );

  const addWindow = useCallback(
    (component: React.ReactNode, options: WindowLayoutOptions) => {
      if (!rcDocRef.current) {
        return;
      }

      // If the panel is already existing, give it focus
      const isExistingPanel = rcDocRef.current.find(options.id);
      if (isExistingPanel) {
        rcDocRef.current.updateTab(isExistingPanel.id!, null, true);
        dispatch(setMenuItemOpen({ id: options.id, open: true }));

        return;
      }

      const position = options.position ?? 'float';
      // Root BoxData that contains all other Boxes & Panels
      const baseID = rcDocRef.current.state.layout.dockbox.id!;
      const base = rcDocRef.current.find(baseID)! as BoxData;

      const tab = createWindowTabData(options.id, options.title, component);
      const SidePanelDefaultWidth = 350;

      switch (position) {
        case 'left':
        case 'right': {
          const index = position == 'left' ? 0 : base.children.length - 1;
          const childTarget: PanelData | BoxData = base.children[index];
          // If the stack is vertical we want to a add panel to left or right side
          const isHorizontalMode = base.mode === 'horizontal';
          // We don't want to select the transparent Openspace window
          const isMainWindow = childTarget.id == 'center';
          // If the target is of type panel we want add a new tab
          const isPanelDataType = isPanelDataInstance(childTarget);

          // Adds a new tab to existing panel
          if (isHorizontalMode && !isMainWindow && isPanelDataType) {
            rcDocRef.current.dockMove(tab, childTarget, 'middle');
          }
          // Adds a new panel to left or right side
          else {
            const panel: PanelData = {
              tabs: [tab],
              size: SidePanelDefaultWidth
            };

            rcDocRef.current.dockMove(panel, base, position);
          }
          break;
        }
        case 'float':
          rcDocRef.current.dockMove(
            tab,
            null,
            'float',
            convertFloatPosition(options.floatPosition)
          );
          break;
        default:
          throw Error('Unhandled window position');
      }

      dispatch(setMenuItemOpen({ id: options.id, open: true }));
    },

    [createWindowTabData, dispatch]
  );

  const closeWindow = useCallback(
    (id: string) => {
      if (!rcDocRef.current) {
        return;
      }

      const existingPanel = rcDocRef.current.find(id);
      if (existingPanel) {
        rcDocRef.current.dockMove(existingPanel as TabData | PanelData, null, 'remove');
        dispatch(setMenuItemOpen({ id: id, open: false }));
      }
    },
    [dispatch]
  );

  return (
    <WindowLayoutContext.Provider
      value={{
        ref: rcDocRef,
        addWindow,
        closeWindow,
        createWindowTabData
      }}
    >
      {children}
    </WindowLayoutContext.Provider>
  );
}
