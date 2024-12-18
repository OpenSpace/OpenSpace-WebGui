import React, { createContext, Ref } from 'react';
import DockLayout, { TabData } from 'rc-dock';

import { WindowLayoutOptions } from './WindowLayout';

export interface ProviderProps {
  ref: Ref<DockLayout>;
  addWindow: (component: React.JSX.Element, options: WindowLayoutOptions) => void;
  closeWindow: (id: string) => void;
  createWindowTabData: (id: string, title: string, content: React.JSX.Element) => TabData;
}

export const WindowLayoutContext = createContext<ProviderProps | null>(null);
