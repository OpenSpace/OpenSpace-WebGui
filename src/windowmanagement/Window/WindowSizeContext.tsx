import { createContext } from 'react';

export interface ProviderProps {
  width: number;
  height: number;
}

export const WindowSizeContext = createContext<ProviderProps | null>(null);
