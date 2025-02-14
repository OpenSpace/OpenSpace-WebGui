import { useContext } from 'react';

import { DynamicGridContext } from './DynamicGridContext';

export function useDynamicGridProvider() {
  const context = useContext(DynamicGridContext);
  if (!context) {
    throw Error('useDynamicGridProvider must be used within a DynamicGridProvider');
  }
  return context;
}
