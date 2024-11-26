import { createContext, Ref, useContext,useRef } from 'react';
import { ScrollArea } from '@mantine/core';
import DockLayout, { BoxData, PanelData, TabData } from 'rc-dock';

import { WindowLayoutOptions } from './WindowLayout';

export interface ProviderProps {
  ref: Ref<DockLayout>;
  addWindow: (component: JSX.Element, options: WindowLayoutOptions) => void;
}

export const WindowManagerContext = createContext<ProviderProps | null>(null);

export function WindowManagerProvider({ children }: { children: React.ReactNode }) {
  const rcDocRef = useRef<DockLayout>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function isPanelDataInstance(obj: any) {
    return obj && Array.isArray(obj.tabs);
  }

  function addWindow(component: JSX.Element, options: WindowLayoutOptions) {
    if (!rcDocRef.current) {
      return;
    }

    // If the panel is already existing, give it focus
    const isExistingPanel = rcDocRef.current.find(options.id);
    if (isExistingPanel) {
      rcDocRef.current.updateTab(isExistingPanel.id!, null, true);
      return;
    }

    const position = options.position ?? 'float';
    // Root BoxData that contains all other Boxes & Panels
    const baseID = rcDocRef.current.state.layout.dockbox.id!;
    const base = rcDocRef.current.find(baseID)! as BoxData;

    const tab: TabData = {
      id: options.id,
      title: options.title,
      content: <ScrollArea h={'100%'}>{component}</ScrollArea>,
      closable: true,
      cached: true,
      group: 'regularWindow'
    };

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
          tab.group = 'regularWindow';
          const panel: PanelData = {
            widthFlex: 6,
            minWidth: 400,
            tabs: [tab]
          };

          rcDocRef.current.dockMove(panel, base, position);
        }
        break;
      }

      case 'float':
        rcDocRef.current.dockMove(tab, null, 'float');
        break;

      default:
        throw Error('Unhandled window position');
    }
  }
  return (
    <WindowManagerContext.Provider
      value={{
        ref: rcDocRef,
        addWindow
      }}
    >
      {children}
    </WindowManagerContext.Provider>
  );
}

export function useWindowManagerProvider() {
  const context = useContext(WindowManagerContext);
  if (!context) {
    throw Error('useWindowManagerProvider must be used within a WindowManagerContext');
  }
  return context;
}
