import React, { createContext, RefObject } from 'react';
import DockLayout, { TabData } from 'rc-dock';

import { WindowLayoutOptions } from './types';

export interface ProviderProps {
  ref: RefObject<DockLayout | null>;
  addWindow: (component: React.ReactNode, options: WindowLayoutOptions) => void;
  closeWindow: (id: string) => void;
  createWindowTabData: (id: string, title: string, content: React.ReactNode) => TabData;
}

export const WindowLayoutContext = createContext<ProviderProps | null>(null);
