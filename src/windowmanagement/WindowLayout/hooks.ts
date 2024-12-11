import { useContext } from 'react';

import { WindowLayoutContext } from './WindowLayoutContext';

export function useWindowLayoutProvider() {
  const context = useContext(WindowLayoutContext);
  if (!context) {
    throw Error('useWindowLayoutProvider must be used within a WindowLayoutContext');
  }
  return context;
}
