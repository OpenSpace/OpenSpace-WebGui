import { createContext } from 'react';

export interface LayoutProps {
  growingSizeHeight: number;
  ref: React.RefObject<HTMLDivElement>;
}

export const LayoutContext = createContext<LayoutProps | null>(null);
