import { useMemo } from 'react';

import { LoadingBlocks } from '../LoadingBlocks/LoadingBlocks';
import { PaginationList } from '../PaginationList/PaginationList';
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
  grid?: boolean;
  estimateSize?: number;
  maxShownMatches?: never;
}

interface NonVirtualizedProps<T> extends BaseProps<T> {
  virtualize?: false;
  gap?: never;
  overscan?: never;
  estimateSize?: never;
  maxShownMatches?: number; // Maximum number of matches to render at once
}

export type FilterListDataProps<T> = VirtualizedProps<T> | NonVirtualizedProps<T>;

export function FilterListData<T>({
  data,
  renderElement,
  matcherFunc,
  virtualize = true,
  gap,
  estimateSize,
  overscan,
  maxShownMatches
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

  if (!virtualize && maxShownMatches && filteredElements.length > maxShownMatches) {
    // If we only allow a certain number of matches to be shown, we need to paginate
    return (
      <PaginationList
        data={filteredElements}
        renderElement={renderElement}
        itemsPerPage={maxShownMatches}
      />
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
      estimateSize={estimateSize}
    />
  ) : (
    <>{filteredElements.map((element, i) => renderElement(element, i))}</>
  );
}
