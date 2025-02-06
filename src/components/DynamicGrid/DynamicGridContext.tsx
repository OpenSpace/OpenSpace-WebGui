import { createContext } from 'react';

export interface ProviderProps {
  minChildSize: number;
  nColumns: number;
}

export const DynamicGridContext = createContext<ProviderProps | null>(null);
