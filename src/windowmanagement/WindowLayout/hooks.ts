import { useContext } from 'react';

import { WindowManagerContext } from './WindowLayoutProvider';

export function useWindowManagerProvider() {
  const context = useContext(WindowManagerContext);
  if (!context) {
    throw Error('useWindowManagerProvider must be used within a WindowManagerContext');
  }
  return context;
}
