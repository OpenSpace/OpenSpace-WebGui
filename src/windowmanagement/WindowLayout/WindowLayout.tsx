import { CloseButton, Stack } from '@mantine/core';
import DockLayout, { DockContext, LayoutData, PanelData, TabGroup } from 'rc-dock';

import { FlightController } from '@/panels/FlightControlPanel/FlightController';
import { TaskBar } from '@/panels/Menu/TaskBar/TaskBar';
import { TopMenuBar } from '@/panels/Menu/TopMenuBar/TopMenuBar';

import { ConnectionErrorOverlay } from '../ConnectionErrorOverlay';

import { useWindowLayoutProvider } from './hooks';
import { FloatWindowPosition } from './types';

import 'rc-dock/dist/rc-dock-dark.css';
import './WindowLayout.css';

export type WindowLayoutPosition = 'left' | 'right' | 'float' | 'top';

export interface WindowLayoutOptions {
  title: string;
  id: string;
  position?: WindowLayoutPosition;
  floatPosition?: FloatWindowPosition;
}

function createDefaultLayout(): LayoutData {
  return {
    dockbox: {
      id: 'base',
      mode: 'horizontal',

      children: [
        {
          id: 'center',
          tabs: [
            {
              title: 'flightController',
              content: <FlightController key={'flightcontrollerdiv'} />,
              id: 'flightController'
            }
          ],
          panelLock: {},
          group: 'headless openspaceView',
          size: 800 // This is quite arbitary chosen, but helps if the first thing you do
          // is moving a panel above the empty area. Increasing this value gives less space
          // for the panel being moved ontop or below
        }
      ]
    }
  };
}

export function WindowLayout() {
  const { ref } = useWindowLayoutProvider();

  const groups: { [key: string]: TabGroup } = {
    // This is the rc-dock group configuration we use for the transparent window in the
    // center. Headless is an existing rc-dock group that removes the tab and the header
    'headless openspaceView': {
      floatable: false,
      maximizable: false,
      tabLocked: true,
      widthFlex: 1
    },
    // This is the rc-dock group configuration for all the other windows. Note that
    // 'card' is a pre-existing rc-dock group that adds certain styling to the tab
    'card regularWindow': {
      maximizable: false,
      heightFlex: 1,
      panelExtra: (panelData: PanelData, context: DockContext) => {
        return (
          <CloseButton
            aria-label={'Close window'}
            onClick={() => context.dockMove(panelData, null, 'remove')}
          />
        );
      }
    }
  };

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

        <TaskBar />
      </Stack>
    </>
  );
}
