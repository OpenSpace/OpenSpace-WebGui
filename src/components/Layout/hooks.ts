import { useContext } from 'react';

import { LayoutContext, LayoutProps } from './LayoutContext';

export function useLayoutProvider() {
  const context = useContext(LayoutContext) as LayoutProps;
  if (!context) {
    throw Error('useLayoutProvider must be used within a LayoutProvider');
  }
  return context;
}
