import { WindowLayoutPosition } from 'src/windowmanagement/WindowLayout/WindowLayout';

import { OriginPanel } from '@/panels/OriginPanel/OriginPanel';
import { OriginPanelMenuButton } from '@/panels/OriginPanel/OriginPanelMenuButton';
import { Scene } from '@/panels/Scene/Scene';
import { SessionRec } from '@/panels/SessionRecording/SessionRec';
import { SessionRecMenuButton } from '@/panels/SessionRecording/SessionRecMenuButton';

export interface MenuItem {
  title: string; // Title of the rc-dock tab
  componentID: string; // Unqiue ID to identify this component among the rc-dock tabs
  content: JSX.Element; // Content to render inside the rc-dock tab
  renderMenuButton?: (key: string, onClick: () => void) => JSX.Element; // Custom menu button to render
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
    title: 'Date Picker',
    componentID: 'datePicker',
    content: <div>Date / Time Menu</div>,
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
    content: <div>Geo Location menu</div>,
    preferredPosition: 'left',
    defaultVisible: true
  },
  {
    title: 'Exoplanets',
    componentID: 'exoplanets',
    content: <div> Exoplanets menu </div>,
    preferredPosition: 'right',
    defaultVisible: false
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
    content: <div>Actions menu</div>,
    preferredPosition: 'float',
    defaultVisible: true
  },
  {
    title: 'Sky Browser',
    componentID: 'skyBrowser',
    content: <div>Sky Broweser</div>,
    preferredPosition: 'right',
    defaultVisible: false
  },
  {
    title: 'Keybindings Layout',
    componentID: 'keybindingsLayout',
    content: <div>Keybindings</div>,
    preferredPosition: 'float',
    defaultVisible: false
  }
];
