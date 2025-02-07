import { PropsWithChildren } from 'react';

import { LoadingBlocks } from '@/components/LoadingBlocks/LoadingBlocks';

import { useFilterListProvider } from '../hooks';

import { SearchResultsPagination } from './SearchResultsPagination';
import { SearchResultsVirtualGrid } from './SearchResultsVirtualGrid';
import { SearchResultsVirtualList } from './SearchResultsVirtualList';

export function SearchResults({ children }: PropsWithChildren) {
  const { showFavorites, isLoading } = useFilterListProvider();
  if (!children) {
    throw Error('FilterList.SearchResults should contain children!');
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
SearchResults.VirtualGrid = SearchResultsVirtualGrid;
