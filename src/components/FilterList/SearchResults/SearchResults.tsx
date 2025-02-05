import { PropsWithChildren } from 'react';

import { LoadingBlocks } from '@/components/LoadingBlocks/LoadingBlocks';

import { useFilterListProvider } from '../hooks';

import { SearchResultsPagination } from './SearchResultsPagination';
import { SearchResultsVirtualList } from './SearchResultsVirtualList';

export interface SearchResultsProps<T> {
  data: T[];
  renderElement: (data: T, i: number) => React.ReactNode;
  matcherFunc: (data: T, searchString: string) => boolean;
}

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
