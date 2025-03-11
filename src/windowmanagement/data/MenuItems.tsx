import React from 'react';

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
  RocketLaunchIcon,
  SettingsIcon,
  TelescopeIcon,
  TreeViewIcon,
  VideocamIcon
} from '@/icons/icons';
import { TaskBarMenuButton } from '@/panels/Menu/TaskBar/TaskBarMenuButton';
import { OriginPanelMenuButton } from '@/panels/OriginPanel/OriginPanelMenuButton';
import { TempPropertyTest } from '@/panels/Scene/TempPropertyTest';
import { SessionRecordingMenuButton } from '@/panels/SessionRecordingPanel/SessionRecordingMenuButton';
import { TimePanelMenuButton } from '@/panels/TimePanel/TimePanelMenuButton';
import { IconSize } from '@/types/enums';
import { MenuItemEventHandlers } from '@/types/types';

import { FloatWindowPosition } from '../WindowLayout/types';
import { WindowLayoutPosition } from '../WindowLayout/WindowLayout';

import {
  ActionsPanel,
  ExoplanetsPanel,
  FlightControlPanel,
  GeoLocationPanel,
  KeybindsPanel,
  MissionsPanel,
  OriginPanel,
  Scene,
  ScreenSpaceRenderablePanel,
  SessionRecordingPanel,
  SettingsPanel,
  SkyBrowserPanel,
  TimePanel,
  UserPanelsPanel
} from './LazyLoads';

export interface MenuItem {
  title: string; // Title of the rc-dock tab
  componentID: string; // Unqiue ID to identify this component among the rc-dock tabs
  content: React.JSX.Element; // Content to render inside the rc-dock tab
  renderMenuButton?: (eventHandlers: MenuItemEventHandlers) => React.JSX.Element; // Custom menu button to render
  renderIcon?: (size: IconSize) => React.JSX.Element; // Custom icon to render
  preferredPosition: WindowLayoutPosition; // Where this panel is instantiated
  floatPosition?: FloatWindowPosition; // Preferred position and size of a floating window given in px,
  // the offset is computed from the panels top left corner to the bottom right corner of the main window
  defaultVisible: boolean; // Whether this panel is visible in the taskbar on startup
  visible?: boolean; // TODO: investigate whether this is needed (as of 2024-10-23 its not being used)
}

export const menuItemsData: Record<string, MenuItem> = {
  scene: {
    title: 'Scene',
    componentID: 'scene',
    content: <Scene />,
    renderMenuButton: (eventHandlers) => (
      <TaskBarMenuButton
        {...eventHandlers}
        leftSection={<TreeViewIcon size={IconSize.lg} />}
      >
        Scene
      </TaskBarMenuButton>
    ),
    renderIcon: (size) => <TreeViewIcon size={size} />,
    preferredPosition: 'left',
    defaultVisible: true
  },
  settings: {
    title: 'Settings',
    componentID: 'settings',
    content: <SettingsPanel />,
    renderMenuButton: (eventHandlers) => (
      <TaskBarMenuButton
        {...eventHandlers}
        leftSection={<SettingsIcon size={IconSize.lg} />}
      >
        Settings
      </TaskBarMenuButton>
    ),
    renderIcon: (size) => <SettingsIcon size={size} />,
    preferredPosition: 'left',
    defaultVisible: false
  },
  navigation: {
    title: 'Navigation',
    componentID: 'navigation',
    content: <OriginPanel />,
    renderMenuButton: (eventHandlers) => (
      <OriginPanelMenuButton eventHandlers={eventHandlers} />
    ),
    renderIcon: (size) => <FocusIcon size={size} />,
    preferredPosition: 'float',
    floatPosition: { offsetY: 100, offsetX: 320, width: 400, height: 440 },
    defaultVisible: true
  },
  datePanel: {
    title: 'Date Panel',
    componentID: 'datePanel',
    content: <TimePanel />,
    renderMenuButton: (eventHandlers) => (
      <TimePanelMenuButton eventHandlers={eventHandlers} />
    ),
    renderIcon: (size) => <CalendarIcon size={size} />,
    preferredPosition: 'float',
    floatPosition: { offsetY: 100, offsetX: 370, width: 410, height: 520 },
    defaultVisible: true
  },
  sessionRecording: {
    title: 'Session Recording',
    componentID: 'sessionRecording',
    content: <SessionRecordingPanel />,
    renderMenuButton: (eventHandlers) => (
      <SessionRecordingMenuButton eventHandlers={eventHandlers} />
    ),
    renderIcon: (size) => <VideocamIcon size={size} />,
    preferredPosition: 'right',
    defaultVisible: true
  },
  geoLocation: {
    title: 'Geo Location',
    componentID: 'geoLocation',
    content: <GeoLocationPanel />,
    renderIcon: (size) => <LocationPinIcon size={size} />,
    preferredPosition: 'right',
    defaultVisible: true
  },
  screenSpaceRenderables: {
    title: 'Screenspace Renderables',
    componentID: 'screenSpaceRenderables',
    content: <ScreenSpaceRenderablePanel />,
    renderIcon: (size) => <InsertPhotoIcon size={size} />,
    preferredPosition: 'right',
    defaultVisible: true
  },
  exoplanets: {
    title: 'Exoplanets',
    componentID: 'exoplanets',
    content: <ExoplanetsPanel />,
    renderIcon: (size) => <ExoplanetIcon size={size} />,
    preferredPosition: 'right',
    defaultVisible: true
  },
  userPanels: {
    title: 'User Panels',
    componentID: 'userPanels',
    content: <UserPanelsPanel />,
    renderIcon: (size) => <BrowserIcon size={size} />,
    preferredPosition: 'right',
    defaultVisible: true
  },
  actions: {
    title: 'Actions',
    componentID: 'actions',
    content: <ActionsPanel />,
    renderIcon: (size) => <DashboardIcon size={size} />,
    preferredPosition: 'right',
    defaultVisible: true
  },
  skyBrowser: {
    title: 'SkyBrowser',
    componentID: 'skyBrowser',
    content: <SkyBrowserPanel />,
    renderIcon: (size) => <TelescopeIcon size={size} />,
    preferredPosition: 'right',
    defaultVisible: true
  },
  mission: {
    title: 'Mission',
    componentID: 'mission',
    content: <MissionsPanel />,
    renderIcon: (size) => <RocketLaunchIcon size={size} />,
    preferredPosition: 'right',
    defaultVisible: true
  },
  flightControl: {
    title: 'Flight Control',
    componentID: 'flightControl',
    content: <FlightControlPanel />,
    renderIcon: (size) => <ExpandArrowsIcon size={size} />,
    preferredPosition: 'right',
    defaultVisible: false
  },
  keybindingsLayout: {
    title: 'Keybindings Layout',
    componentID: 'keybindingsLayout',
    content: <KeybindsPanel />,
    renderIcon: (size) => <KeyboardIcon size={size} />,
    preferredPosition: 'float',
    floatPosition: { offsetY: 150, offsetX: 350, width: 1050, height: 680 },
    defaultVisible: false
  },
  propertyTest: {
    title: 'Property Test (TEMP)',
    componentID: 'propertyTest',
    content: <TempPropertyTest />,
    preferredPosition: 'left',
    defaultVisible: false
  }
};

if (import.meta.env.DEV) {
  Object.entries(menuItemsData).forEach(([key, value]) => {
    if (key !== value.componentID) {
      throw Error(
        `Menu item key '${key}' does not match componentID '${value.componentID}'`
      );
    }
  });
}
