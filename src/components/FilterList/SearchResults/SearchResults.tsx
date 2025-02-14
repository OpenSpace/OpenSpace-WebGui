import { PropsWithChildren, useMemo } from 'react';

import { LoadingBlocks } from '@/components/LoadingBlocks/LoadingBlocks';

import { renderFunc } from '../FilterListContext';
import { useFilterListProvider } from '../hooks';

import { SearchResultContext } from './SearchResultContext';
import { SearchResultsPagination } from './SearchResultsPagination';
import { SearchResultsVirtualGrid } from './SearchResultsVirtualGrid';
import { SearchResultsVirtualList } from './SearchResultsVirtualList';

interface Props<T> extends PropsWithChildren {
  renderElement: renderFunc<T>;
  data: T[];
  matcherFunc: (data: T, searchString: string) => boolean;
}

export function SearchResults<T>({
  data,
  matcherFunc,
  renderElement,
  children
}: Props<T>) {
  const { showFavorites, isLoading, searchString } = useFilterListProvider();

  // Memoizing this function so we don't need to recreate it when
  // the renderElement function changes
  const filteredItems = useMemo(
    () => data.filter((e) => matcherFunc(e, searchString)),
    [searchString, matcherFunc, data]
  );

  if (!children) {
    throw Error(
      'FilterList.SearchResults must contain children! Please provide a search result type component as the child of this component.'
    );
  }

  if (showFavorites) {
    return <></>;
  }

  if (isLoading) {
    return <LoadingBlocks />;
  }

  return (
    <SearchResultContext.Provider value={{ filteredItems, renderElement }}>
      {children}
    </SearchResultContext.Provider>
  );
}

SearchResults.VirtualGrid = SearchResultsVirtualGrid;
SearchResults.VirtualList = SearchResultsVirtualList;
SearchResults.Pagination = SearchResultsPagination;
