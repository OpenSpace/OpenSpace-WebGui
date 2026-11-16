import React from 'react';
import i18next from 'i18next';

import {
  BrowserIcon,
  CalendarIcon,
  DashboardIcon,
  DevIcon,
  ExoplanetIcon,
  ExpandArrowsIcon,
  FocusIcon,
  GlobeIcon,
  InsertPhotoIcon,
  KeyboardIcon,
  LocationPinIcon,
  NightSkyIcon,
  OpenFolderIcon,
  RocketLaunchIcon,
  RouteIcon,
  SceneIcon,
  ScriptLogIcon,
  SettingsIcon,
  TelescopeIcon,
  VideocamIcon
} from '@/icons/icons';
import { DevPanel } from '@/panels/DevPanel/DevPanel';
import { ToolbarMenuButton } from '@/panels/Menu/Toolbar/ToolbarMenuButton';
import { NavigationPanelMenuButton } from '@/panels/NavigationPanel/MenuButton/NavigationPanelMenuButton';
import { SessionRecordingMenuButton } from '@/panels/SessionRecordingPanel/SessionRecordingMenuButton';
import { TimePanelMenuButtonContent } from '@/panels/TimePanel/MenuButton/TimePanelMenuButtonContent';
import { IconSize } from '@/types/enums';
import { MenuItemGroup, menuItemGroups } from '@/types/types';

import { FloatWindowPosition, WindowLayoutPosition } from '../WindowLayout/types';

import {
  ActionsPanel,
  AssetsPanel,
  ExoplanetsPanel,
  FlightControlPanel,
  GeoLocationPanel,
  GettingStartedPanel,
  GlobeImageryBrowserPanel,
  KeybindsPanel,
  MissionsPanel,
  NavigationPanel,
  NightSkyPanel,
  Scene,
  ScreenSpaceRenderablePanel,
  ScriptLogPanel,
  SessionRecordingPanel,
  SettingsPanel,
  SkyBrowserPanel,
  TimePanel,
  UserPanelsPanel
} from './LazyLoads';

export interface MenuItem {
  title: () => string; // Title of the rc-dock tab
  componentID: string; // Unqiue ID to identify this component among the rc-dock tabs
  content: React.ReactNode; // Content to render inside the rc-dock tab
  renderMenuButton?: (id: string) => React.JSX.Element; // Custom menu button to render
  renderIcon?: (size: IconSize) => React.JSX.Element; // Custom icon to render
  preferredPosition: WindowLayoutPosition; // Where this panel is instantiated
  floatPosition?: FloatWindowPosition; // Preferred position and size of a floating window given in px,
  // the offset is computed from the panels top left corner to the bottom right corner of the main window
  defaultVisible: boolean; // Whether this panel is visible in the toolbar on startup
  group: MenuItemGroup;
}

export const menuItemsData: Record<string, MenuItem> = {
  scene: {
    title: () => i18next.t('menu:panels.scene'),
    componentID: 'scene',
    content: <Scene />,
    renderMenuButton: (id) => (
      <ToolbarMenuButton id={id} leftSection={<SceneIcon size={IconSize.lg} />}>
        Scene
      </ToolbarMenuButton>
    ),
    renderIcon: (size) => <SceneIcon size={size} />,
    preferredPosition: 'left',
    defaultVisible: true,
    group: 'Ungrouped'
  },
  settings: {
    title: () => i18next.t('menu:panels.settings'),
    componentID: 'settings',
    content: <SettingsPanel />,
    renderMenuButton: (id) => (
      <ToolbarMenuButton id={id} leftSection={<SettingsIcon size={IconSize.lg} />}>
        Settings
      </ToolbarMenuButton>
    ),
    renderIcon: (size) => <SettingsIcon size={size} />,
    preferredPosition: 'left',
    defaultVisible: false,
    group: 'Ungrouped'
  },
  navigation: {
    title: () => i18next.t('menu:panels.navigation'),
    componentID: 'navigation',
    content: <NavigationPanel />,
    renderMenuButton: (id) => <NavigationPanelMenuButton id={id} />,
    renderIcon: (size) => <FocusIcon size={size} />,
    preferredPosition: 'float',
    floatPosition: { offsetY: 100, offsetX: 320, width: 400, height: 440 },
    defaultVisible: true,
    group: 'Ungrouped'
  },
  timePanel: {
    title: () => i18next.t('menu:panels.timePanel'),
    componentID: 'timePanel',
    content: <TimePanel />,
    renderMenuButton: (id) => (
      <ToolbarMenuButton id={id}>
        <TimePanelMenuButtonContent />
      </ToolbarMenuButton>
    ),
    renderIcon: (size) => <CalendarIcon size={size} />,
    preferredPosition: 'float',
    floatPosition: { offsetY: 100, offsetX: 370, width: 410, height: 520 },
    defaultVisible: true,
    group: 'Ungrouped'
  },
  sessionRecording: {
    title: () => i18next.t('menu:panels.sessionRecording'),
    componentID: 'sessionRecording',
    content: <SessionRecordingPanel />,
    renderMenuButton: (id) => <SessionRecordingMenuButton id={id} />,
    renderIcon: (size) => <VideocamIcon size={size} />,
    preferredPosition: 'right',
    defaultVisible: true,
    group: 'Other'
  },
  geoLocation: {
    title: () => i18next.t('menu:panels.geoLocation'),
    componentID: 'geoLocation',
    content: <GeoLocationPanel />,
    renderIcon: (size) => <LocationPinIcon size={size} />,
    preferredPosition: 'right',
    defaultVisible: true,
    group: 'Content'
  },
  screenSpaceRenderables: {
    title: () => i18next.t('menu:panels.screenSpaceRenderables'),
    componentID: 'screenSpaceRenderables',
    content: <ScreenSpaceRenderablePanel />,
    renderIcon: (size) => <InsertPhotoIcon size={size} />,
    preferredPosition: 'right',
    defaultVisible: true,
    group: 'Ungrouped'
  },
  exoplanets: {
    title: () => i18next.t('menu:panels.exoplanets'),
    componentID: 'exoplanets',
    content: <ExoplanetsPanel />,
    renderIcon: (size) => <ExoplanetIcon size={size} />,
    preferredPosition: 'right',
    defaultVisible: true,
    group: 'Content'
  },
  userPanels: {
    title: () => i18next.t('menu:panels.userPanels'),
    componentID: 'userPanels',
    content: <UserPanelsPanel />,
    renderIcon: (size) => <BrowserIcon size={size} />,
    preferredPosition: 'right',
    defaultVisible: true,
    group: 'Other'
  },
  actions: {
    title: () => i18next.t('menu:panels.actions'),
    componentID: 'actions',
    content: <ActionsPanel />,
    renderIcon: (size) => <DashboardIcon size={size} />,
    preferredPosition: 'right',
    defaultVisible: true,
    group: 'Ungrouped'
  },
  skyBrowser: {
    title: () => i18next.t('menu:panels.skyBrowser'),
    componentID: 'skyBrowser',
    content: <SkyBrowserPanel />,
    renderIcon: (size) => <TelescopeIcon size={size} />,
    preferredPosition: 'right',
    defaultVisible: true,
    group: 'Content'
  },
  mission: {
    title: () => i18next.t('menu:panels.mission'),
    componentID: 'mission',
    content: <MissionsPanel />,
    renderIcon: (size) => <RocketLaunchIcon size={size} />,
    preferredPosition: 'right',
    defaultVisible: false,
    group: 'Content'
  },
  flightControl: {
    title: () => i18next.t('menu:panels.flightControl'),
    componentID: 'flightControl',
    content: <FlightControlPanel />,
    renderIcon: (size) => <ExpandArrowsIcon size={size} />,
    preferredPosition: 'right',
    defaultVisible: !window.isWithinCEF,
    group: 'Other'
  },
  keybindingsLayout: {
    title: () => i18next.t('menu:panels.keybindingsLayout'),
    componentID: 'keybindingsLayout',
    content: <KeybindsPanel />,
    renderIcon: (size) => <KeyboardIcon size={size} />,
    preferredPosition: 'float',
    floatPosition: { offsetY: 150, offsetX: 350, width: 1100, height: 680 },
    defaultVisible: false,
    group: 'Help'
  },
  nightSky: {
    title: () => i18next.t('menu:panels.nightSky'),
    componentID: 'nightSky',
    content: <NightSkyPanel />,
    renderIcon: (size) => <NightSkyIcon size={size} />,
    preferredPosition: 'right',
    defaultVisible: false,
    group: 'Content'
  },
  gettingStartedTour: {
    title: () => i18next.t('menu:panels.gettingStartedTour'),
    componentID: 'gettingStartedTour',
    content: <GettingStartedPanel />,
    renderIcon: (size) => <RouteIcon size={size} style={{ transform: 'scale(-1)' }} />,
    preferredPosition: 'float',
    floatPosition: { offsetY: 150, offsetX: 350, width: 600, height: 500 },
    defaultVisible: false,
    group: 'Help'
  },
  scriptLogPanel: {
    title: () => i18next.t('menu:panels.scriptLogPanel'),
    componentID: 'scriptLogPanel',
    content: <ScriptLogPanel />,
    renderIcon: (size) => <ScriptLogIcon size={size} />,
    preferredPosition: 'right',
    defaultVisible: false,
    group: 'Other'
  },
  globeImageryBrowserPanel: {
    title: () => i18next.t('menu:panels.globeImageryBrowserPanel'),
    componentID: 'globeImageryBrowserPanel',
    content: <GlobeImageryBrowserPanel />,
    renderIcon: (size) => <GlobeIcon size={size} />,
    preferredPosition: 'right',
    defaultVisible: false,
    group: 'Content'
  },
  assetsPanel: {
    title: () => i18next.t('menu:panels.assetsPanel'),
    componentID: 'assetsPanel',
    content: <AssetsPanel />,
    renderIcon: (size) => <OpenFolderIcon size={size} />,
    preferredPosition: 'right',
    defaultVisible: false,
    group: 'Content'
  }
};

if (import.meta.env.DEV) {
  // Add an extra panel for dev-specific content
  menuItemsData.devPanel = {
    title: () => i18next.t('menu:panels.devPanel'),
    componentID: 'devPanel',
    content: <DevPanel />,
    renderIcon: (size) => <DevIcon size={size} />,
    preferredPosition: 'right',
    defaultVisible: false,
    group: 'Ungrouped'
  };

  Object.entries(menuItemsData).forEach(([key, value]) => {
    if (key !== value.componentID) {
      throw Error(
        `Menu item key '${key}' does not match componentID '${value.componentID}'`
      );
    }
  });

  const groupUsage = Object.fromEntries(menuItemGroups.map((group) => [group, false]));
  Object.values(menuItemsData).forEach((menuItem) => (groupUsage[menuItem.group] = true));
  Object.entries(groupUsage).forEach(([group, inUse]) => {
    if (!inUse) {
      throw Error(`Group '${group}' is not used by any menu item`);
    }
  });
}
