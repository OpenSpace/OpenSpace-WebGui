import { createContext } from 'react';

export interface ProviderProps {
  width: number;
  height: number;
  pointerEvents: { enable: () => void; disable: () => void };
}

export const WindowSizeContext = createContext<ProviderProps | null>(null);
