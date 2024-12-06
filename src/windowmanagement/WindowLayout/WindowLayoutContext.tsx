import { createContext, Ref } from 'react';
import DockLayout from 'rc-dock';

import { WindowLayoutOptions } from './WindowLayout';

export interface ProviderProps {
  ref: Ref<DockLayout>;
  addWindow: (component: JSX.Element, options: WindowLayoutOptions) => void;
}

export const WindowLayoutContext = createContext<ProviderProps | null>(null);
