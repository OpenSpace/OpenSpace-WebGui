import React from 'react';
import { Button } from '@mantine/core';
import { WindowLayoutPosition } from 'src/windowmanagement/WindowLayout/WindowLayout';

import {
  BrowserIcon,
  CalendarIcon,
  DashboardIcon,
  ExoplanetIcon,
  ExpandArrowsIcon,
  FocusIcon,
  InsertPhotoIcon,
  KeyboardIcon,
  LocationPinIcon,
  TelescopeIcon,
  TreeViewIcon,
  VideocamIcon
} from '@/icons/icons';
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
import { IconSize } from '@/types/enums';

export interface MenuItem {
  title: string; // Title of the rc-dock tab
  componentID: string; // Unqiue ID to identify this component among the rc-dock tabs
  content: React.JSX.Element; // Content to render inside the rc-dock tab
  renderMenuButton?: (key: string, onClick: () => void) => React.JSX.Element; // Custom menu button to render
  icon?: (size: IconSize) => React.JSX.Element; // Custom icon to render
  preferredPosition: WindowLayoutPosition; // Where this panel is instantiated
  defaultVisible: boolean; // Whether this panel is visible in the taskbar on startup
  visible?: boolean; // TODO: investigate whether this is needed (as of 2024-10-23 its not being used)
}

export const menuItemsDB: MenuItem[] = [
  {
    title: 'Scene',
    componentID: 'scene',
    content: <Scene />,
    renderMenuButton: (key, onclick) => (
      <Button
        key={key}
        onClick={onclick}
        leftSection={<TreeViewIcon size={IconSize.lg} />}
        size={'xl'}
      >
        Scene
      </Button>
    ),
    icon: (size) => <TreeViewIcon size={size} />,
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
    icon: (size) => <FocusIcon size={size} />,
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
    icon: (size) => <CalendarIcon size={size} />,
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
    icon: (size) => <VideocamIcon size={size} />,
    preferredPosition: 'right',
    defaultVisible: true
  },
  {
    title: 'Geo Location',
    componentID: 'geoLocation',
    content: <GeoLocationPanel />,
    icon: (size) => <LocationPinIcon size={size} />,
    preferredPosition: 'right',
    defaultVisible: true
  },
  {
    title: 'Screenspace Renderables',
    componentID: 'screenSpaceRenderables',
    content: <ScreenSpaceRenderablePanel />,
    icon: (size) => <InsertPhotoIcon size={size} />,
    preferredPosition: 'right',
    defaultVisible: true
  },
  {
    title: 'Exoplanets',
    componentID: 'exoplanets',
    content: <ExoplanetsPanel />,
    icon: (size) => <ExoplanetIcon size={size} />,
    preferredPosition: 'right',
    defaultVisible: true
  },
  {
    title: 'User Panels',
    componentID: 'userPanels',
    content: <UserPanelsPanel />,
    icon: (size) => <BrowserIcon size={size} />,
    preferredPosition: 'float',
    defaultVisible: true
  },
  {
    title: 'Actions',
    componentID: 'actions',
    content: <ActionsPanel />,
    icon: (size) => <DashboardIcon size={size} />,
    preferredPosition: 'float',
    defaultVisible: true
  },
  {
    title: 'Sky Browser',
    componentID: 'skyBrowser',
    content: <div>Sky Broweser</div>,
    icon: (size) => <TelescopeIcon size={size} />,
    preferredPosition: 'right',
    defaultVisible: true
  },
  {
    title: 'Flight Control',
    componentID: 'flightControl',
    content: <FlightControlPanel />,
    icon: (size) => <ExpandArrowsIcon size={size} />,
    preferredPosition: 'right',
    defaultVisible: false
  },
  {
    title: 'Keybindings Layout',
    componentID: 'keybindingsLayout',
    content: <div>Keybindings</div>,
    icon: (size) => <KeyboardIcon size={size} />,
    preferredPosition: 'float',
    defaultVisible: false
  }
];
