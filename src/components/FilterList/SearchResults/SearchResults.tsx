import { PropsWithChildren } from 'react';

import { LoadingBlocks } from '@/components/LoadingBlocks/LoadingBlocks';

import { useFilterListProvider } from '../hooks';

import { SearchResultsPagination } from './SearchResultsPagination';
import { SearchResultsVirtualList } from './SearchResultsVirtualList';

export function SearchResults({ children }: PropsWithChildren) {
  const { showFavorites, isLoading } = useFilterListProvider();
  if (!children) {
    throw Error('FilterList.SearchResults must contain children! Please provide a search result type component as the  child of this component);
  }
  if (showFavorites) {
    return <></>;
  }
  if (isLoading) {
    return <LoadingBlocks />;
  }
  return <>{children}</>;
}

SearchResults.VirtualList = SearchResultsVirtualList;
SearchResults.Pagination = SearchResultsPagination;
