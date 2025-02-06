import { PropsWithChildren } from 'react';

import { DynamicGridContext } from './DynamicGridContext';

interface Props extends PropsWithChildren {
  minChildSize: number;
  nColumns: number;
}
export function DynamicGridProvider({ minChildSize, nColumns, children }: Props) {
  return (
    <DynamicGridContext.Provider value={{ minChildSize, nColumns }}>
      {children}
    </DynamicGridContext.Provider>
  );
}
