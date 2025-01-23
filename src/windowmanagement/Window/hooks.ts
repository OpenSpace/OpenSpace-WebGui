import { useContext } from 'react';

import { WindowSizeContext } from './Window';

export function useWindowSize() {
  const context = useContext(WindowSizeContext);
  if (!context) {
    throw Error('useWindowSize must be used within a WindowSizeContext');
  }
  return context;
}
