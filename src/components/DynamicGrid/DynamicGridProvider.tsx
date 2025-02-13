import { PropsWithChildren } from 'react';

import { DynamicGridContext } from './DynamicGridContext';

interface Props extends PropsWithChildren {
  minChildSize: number;
  columns: number;
  gridWidth?: number;
}
export function DynamicGridProvider({
  minChildSize,
  columns,
  gridWidth,
  children
}: Props) {
  return (
    <DynamicGridContext.Provider value={{ minChildSize, columns, gridWidth }}>
      {children}
    </DynamicGridContext.Provider>
  );
}
