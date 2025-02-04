import { useMemo } from 'react';

import { LoadingBlocks } from '../LoadingBlocks/LoadingBlocks';
import { VirtualList } from '../VirtualList/VirtualList';

import { useFilterListProvider } from './hooks';

export const FilterListDataDisplayName = 'FilterListData';

interface BaseProps<T> {
  data: T[];
  renderElement: (data: T, i: number) => React.ReactNode;
  matcherFunc: (data: T, searchString: string) => boolean;
}

interface VirtualizedProps<T> extends BaseProps<T> {
  virtualize?: true;
  gap?: number; // Gap in pixels between items
  overscan?: number; // How many items to preload when scrolling
  maxAllowedMatches?: never;
}

interface NonVirtualizedProps<T> extends BaseProps<T> {
  virtualize?: false;
  gap?: never;
  overscan?: never;
  maxAllowedMatches?: number; // Maximum number of matches for the list to render
}

export type FilterListDataProps<T> = VirtualizedProps<T> | NonVirtualizedProps<T>;

export function FilterListData<T>({
  data,
  renderElement,
  matcherFunc,
  virtualize = true,
  gap,
  overscan,
  maxAllowedMatches
}: FilterListDataProps<T>) {
  const { searchString, showFavorites, isLoading } = useFilterListProvider();

  // Memoizing this function so we don't need to recreate it when
  // the renderElement function changes
  const filteredElements = useMemo(
    () => data.filter((e) => matcherFunc(e, searchString)),
    [searchString, matcherFunc, data]
  );

  if (showFavorites) {
    return <></>;
  }

  if (isLoading) {
    return <LoadingBlocks />;
  }

  if (!virtualize && maxAllowedMatches && filteredElements.length > maxAllowedMatches) {
    return (
      <>
        Too many matches. Try narrowing down your search...
        <LoadingBlocks />
      </>
    );
  }

  if (filteredElements.length === 0) {
    return <>No matches found. Try another search</>;
  }

  return virtualize ? (
    <VirtualList
      data={filteredElements}
      renderElement={renderElement}
      gap={gap}
      overscan={overscan}
    />
  ) : (
    <>{filteredElements.map((element, i) => renderElement(element, i))}</>
  );
}
