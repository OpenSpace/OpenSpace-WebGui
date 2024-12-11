import { useContext } from 'react';

import { FilterListContext } from './FilterListContext';

export function useFilterListProvider() {
  const context = useContext(FilterListContext);
  if (!context) {
    throw Error('useFilterListProvider must be used within a FilterListProvider');
  }
  return context;
}
