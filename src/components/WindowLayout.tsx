import { useEffect, useRef } from 'react';
import { Button, Container, Stack } from '@mantine/core';
import DockLayout, { BoxData, LayoutData, PanelData, TabData, TabGroup } from 'rc-dock';

import { TaskBar } from '@/components/TaskBar';
import { startConnection } from '@/redux/connection/connectionSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';

import { ActionsPanel } from './ActionsPanel';
import { ConnectionErrorOverlay } from './ConnectionErrorOverlay';
import { TopMenuBar } from './TopMenuBar';

import 'rc-dock/dist/rc-dock-dark.css';
import './WindowLayout.css';

function createDefaultLayout(
  addWindow: (component: JSX.Element, options: WindowLayoutOptions) => void
): LayoutData {
  return {
    dockbox: {
      id: 'base',
      mode: 'horizontal',

      children: [
        {
          tabs: [
            {
              id: 'left',
              title: 'Test',
              closable: true,
              group: 'regularWindow',
              content: (
                <>
                  <div>Hello World</div>
                  <TaskBar addWindow={addWindow} />
                  <Button
                    onClick={() => {
                      addWindow(
                        <Container>
                          <h1>New tab</h1>
                        </Container>,
                        {
                          position: 'right',
                          title: 'new window'
                        }
                      );
                    }}
                  >
                    Right Side
                  </Button>
                  <Button
                    onClick={() => {
                      addWindow(<h1>Floating</h1>, {
                        title: 'new floating'
                      });
                    }}
                  >
                    Floating window
                  </Button>
                </>
              )
            }
          ]
        },
        {
          id: 'center',
          tabs: [],
          //   size: 1000,
          panelLock: {},
          group: 'headless'
        }
      ]
    },
    floatbox: {
      mode: 'float',
      children: [
        {
          tabs: [
            {
              id: 'actions',
              title: 'Actions',
              closable: true,
              content: <ActionsPanel />,
              group: 'regularWindow'
            }
          ],
          x: 150,
          y: 150,
          w: 320,
          h: 450
        }
      ]
    }
  };
}

export interface WindowLayoutOptions {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  title: string;
  position?: 'left' | 'right' | 'float' | 'top';
}

export function WindowLayout() {
  const rcDocRef = useRef<DockLayout>(null);
  const connectionLost = useAppSelector((state) => state.connection.connectionLost);
  const dispatch = useAppDispatch();
  console.log(connectionLost);

  useEffect(() => {
    dispatch(startConnection());
  }, []);

  const headless: TabGroup = {
    floatable: false,
    maximizable: false,
    tabLocked: true,
    widthFlex: 10
  };
  const regularWindow: TabGroup = {
    maximizable: false,
    widthFlex: 1
  };
  const groups = {
    headless,
    regularWindow
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function isPanelDataInstance(obj: any) {
    return obj && Array.isArray(obj.tabs);
  }

  function addWindow(component: JSX.Element, options: WindowLayoutOptions) {
    if (!rcDocRef.current) {
      return;
    }

    // If the panel is already existing, give it focus
    const isExistingPanel = rcDocRef.current.find(options.title);
    if (isExistingPanel) {
      rcDocRef.current.updateTab(isExistingPanel.id!, null, true);
      return;
    }

    const position = options.position ?? 'float';
    // Top BoxData that contains all other Boxes & Panels
    const baseID = rcDocRef.current.state.layout.dockbox.id!;
    const base = rcDocRef.current.find(baseID)! as BoxData;

    const tab: TabData = {
      id: options.title,
      title: options.title,
      content: component,
      closable: true,
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
          tab.group = 'newPanel';
          const panel: PanelData = {
            widthFlex: 6,
            minWidth: 400,
            tabs: [tab]
          };

          rcDocRef.current.dockMove(panel, base, position);
          console.log(rcDocRef.current.state.layout);
        }
        break;
      }

      case 'float':
        rcDocRef.current.dockMove(tab, null, 'float');
        break;

      default:
        throw Error('Unhandeled window position');
    }
  }
  return (
    <>
      <ConnectionErrorOverlay />
      <Stack
        gap={0}
        style={{
          height: '100vh'
        }}
      >
        <TopMenuBar />

        <div
          style={{
            flexGrow: 1, // DockLayout takes up remaining space
            position: 'relative'
          }}
        >
          <DockLayout
            ref={rcDocRef}
            defaultLayout={createDefaultLayout(addWindow)}
            groups={groups}
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              bottom: 0,
              left: 0
            }}
          />
        </div>

        <TaskBar addWindow={addWindow}></TaskBar>
      </Stack>
    </>
  );
}
