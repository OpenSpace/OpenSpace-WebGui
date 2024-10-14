import { SessionRec } from '@/components/SessionRec';
import { WindowLayoutPosition } from 'src/windowmanagement/WindowLayout/WindowLayout';
import { Scene } from '@/panels/Scene/Scene';

export interface MenuItem {
  title: string;
  componentID: string;
  content: JSX.Element;
  preferredPosition: WindowLayoutPosition;
  defaultVisible: boolean;
  visible?: boolean;
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
    content: <div>Focus menu</div>,
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
