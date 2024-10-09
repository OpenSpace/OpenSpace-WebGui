import { Scene } from '@/components/Scene';
import { SessionRec } from '@/components/SessionRec';
import { WindowLayoutPosition } from '@/components/WindowLayout';

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
    title: 'Session Recording',
    componentID: 'sessionRecording',
    content: <SessionRec />,
    preferredPosition: 'right',
    defaultVisible: false
  }
];
