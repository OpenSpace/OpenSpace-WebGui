import { useEffect, useRef, useState } from 'react';
import { ScrollArea, Stack } from '@mantine/core';
import DockLayout, { BoxData, LayoutData, PanelData, TabData, TabGroup } from 'rc-dock';

import { onCloseConnection, startConnection } from '@/redux/connection/connectionSlice';
import { useAppDispatch } from '@/redux/hooks';

import { ConnectionErrorOverlay } from '../ConnectionErrorOverlay';
import { menuItemsDB } from '../data/MenuItems';
import { TaskBar } from '../TaskBar';
import { TopMenuBar } from '../TopMenuBar';

import { useWindowManagerProvider } from './WindowLayoutProvider';

import 'rc-dock/dist/rc-dock-dark.css';
import './WindowLayout.css';

export type WindowLayoutPosition = 'left' | 'right' | 'float' | 'top';
export interface WindowLayoutOptions {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  title: string;
  id: string;
  position?: WindowLayoutPosition;
}

function createDefaultLayout(): LayoutData {
  return {
    dockbox: {
      id: 'base',
      mode: 'horizontal',

      children: [
        {
          id: 'center',
          tabs: [],
          //   size: 1000,
          panelLock: {},
          group: 'headless'
        }
      ]
    }
  };
}

export function WindowLayout() {
  const { ref, addWindow } = useWindowManagerProvider();
  const [visibleMenuItems, setVisibleMenuItems] = useState<string[]>([]);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(startConnection());
    return () => {
      dispatch(onCloseConnection());
    };
  }, [dispatch]);

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

  // Populate default visible items for taskbar
  useEffect(() => {
    const defaultVisibleMenuItems = menuItemsDB
      .map((menuItem) => {
        if (menuItem.defaultVisible) {
          return menuItem.componentID;
        }
        return ''; // We dont want to return undefined so we do empty string instead
      })
      .filter((id) => id !== ''); // And then clean up the empty strings...

    setVisibleMenuItems(defaultVisibleMenuItems);
  }, []);

  return (
    <>
      <ConnectionErrorOverlay />
      <Stack
        gap={0}
        style={{
          height: '100vh'
        }}
      >
        <TopMenuBar
          visibleMenuItems={visibleMenuItems}
          setVisibleMenuItems={setVisibleMenuItems}
          addWindow={addWindow}
        />
        <div
          style={{
            flexGrow: 1, // DockLayout takes up remaining space
            position: 'relative'
          }}
        >
          <DockLayout
            ref={ref}
            defaultLayout={createDefaultLayout()}
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

        <TaskBar addWindow={addWindow} visibleMenuItems={visibleMenuItems}></TaskBar>
      </Stack>
    </>
  );
}
