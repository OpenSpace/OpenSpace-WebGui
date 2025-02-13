import { createContext } from 'react';

export interface ProviderProps {
  minChildSize: number;
  columns: number;
  gridWidth?: number;
}

export const DynamicGridContext = createContext<ProviderProps | null>(null);
