import { useContext } from 'react';

import { FilterListContext, FilterListProviderProps } from './FilterListContext';

export function useFilterListProvider() {
  const context = useContext(FilterListContext) as FilterListProviderProps;
  if (!context) {
    throw Error('useFilterListProvider must be used within a FilterListProvider');
  }
  return context;
}
