import React from 'react';
import { WindowLayoutPosition } from 'src/windowmanagement/WindowLayout/WindowLayout';

import { ActionsPanel } from '@/panels/ActionsPanel/ActionsPanel';
import { ExoplanetsPanel } from '@/panels/ExoplanetsPanel/ExoplanetsPanel';
import { FlightControlPanel } from '@/panels/FlightControlPanel/FlightControlPanel';
import { GeoLocationPanel } from '@/panels/GeoLocationPanel/GeoLocationPanel';
import { OriginPanel } from '@/panels/OriginPanel/OriginPanel';
import { OriginPanelMenuButton } from '@/panels/OriginPanel/OriginPanelMenuButton';
import { Scene } from '@/panels/Scene/Scene';
import { ScreenSpaceRenderablePanel } from '@/panels/ScreenSpaceRenderablePanel/ScreenSpaceRenderablePanel';
import { SessionRec } from '@/panels/SessionRecording/SessionRec';
import { SessionRecMenuButton } from '@/panels/SessionRecording/SessionRecMenuButton';
import { TimePanel } from '@/panels/TimePanel/TimePanel';
import { TimePanelMenuButton } from '@/panels/TimePanel/TimePanelMenuButton';
import { UserPanelsPanel } from '@/panels/UserPanelsPanel/UserPanelsPanel';
import { SkyBrowserPanel } from '@/panels/SkyBrowserPanel/SkyBrowserPanel';

export interface MenuItem {
  title: string; // Title of the rc-dock tab
  componentID: string; // Unqiue ID to identify this component among the rc-dock tabs
  content: React.JSX.Element; // Content to render inside the rc-dock tab
  renderMenuButton?: (key: string, onClick: () => void) => React.JSX.Element; // Custom menu button to render
  preferredPosition: WindowLayoutPosition; // Where this panel is instantiated
  defaultVisible: boolean; // Whether this panel is visible in the taskbar on startup
  visible?: boolean; // TODO: investigate whether this is needed (as of 2024-10-23 its not being used)
}

export const menuItemsDB: MenuItem[] = [
  {
    title: 'Scene',
    componentID: 'scene',
    content: <Scene />,
    preferredPosition: 'left',
    defaultVisible: true
  },
  {
    title: 'Focus',
    componentID: 'focus',
    content: <OriginPanel />,
    renderMenuButton: (key, onClick) => (
      <OriginPanelMenuButton key={key} onClick={onClick} />
    ),
    preferredPosition: 'float',
    defaultVisible: true
  },
  {
    title: 'Date Panel',
    componentID: 'datePanel',
    content: <TimePanel />,
    renderMenuButton: (key, onClick) => (
      <TimePanelMenuButton key={key} onClick={onClick} />
    ),
    preferredPosition: 'float',
    defaultVisible: true
  },
  {
    title: 'Session Recording',
    componentID: 'sessionRecording',
    content: <SessionRec />,
    renderMenuButton: (key, onClick) => (
      <SessionRecMenuButton key={key} onClick={onClick} />
    ),
    preferredPosition: 'right',
    defaultVisible: true
  },
  {
    title: 'Geo Location',
    componentID: 'geoLocation',
    content: <GeoLocationPanel />,
    preferredPosition: 'left',
    defaultVisible: true
  },
  {
    title: 'Screenspace Renderables',
    componentID: 'screenSpaceRenderables',
    content: <ScreenSpaceRenderablePanel />,
    preferredPosition: 'right',
    defaultVisible: true
  },
  {
    title: 'Exoplanets',
    componentID: 'exoplanets',
    content: <ExoplanetsPanel />,
    preferredPosition: 'right',
    defaultVisible: true
  },
  {
    title: 'User Control',
    componentID: 'userControl',
    content: <div>User control menu</div>,
    preferredPosition: 'right',
    defaultVisible: false
  },
  {
    title: 'Actions',
    componentID: 'actions',
    content: <ActionsPanel />,
    preferredPosition: 'float',
    defaultVisible: true
  },
  {
    title: 'Flight Control',
    componentID: 'flightControl',
    content: <FlightControlPanel />,
    preferredPosition: 'right',
    defaultVisible: false
  },
  {
    title: 'Keybindings Layout',
    componentID: 'keybindingsLayout',
    content: <div>Keybindings</div>,
    preferredPosition: 'float',
    defaultVisible: false
  },
  {
    title: 'User Panels',
    componentID: 'userPanels',
    content: <UserPanelsPanel />,
    preferredPosition: 'float',
    defaultVisible: true
  },
  {
    title: 'Sky Browser',
    componentID: 'skyBrowser',
    content: <SkyBrowserPanel />,
    preferredPosition: 'right',
    defaultVisible: true
  }
];
