import { useContext } from 'react';

import { SearchResultContext, SearchResultsProviderProps } from './SearchResultContext';

export function useSearchResultProvider<T>() {
  const context = useContext(SearchResultContext) as SearchResultsProviderProps<T>;
  if (!context) {
    throw Error('useSearchResultProvider must be used within a SearchResultProvider');
  }
  return context;
}
