import { useMemo } from 'react';

import { VirtualList } from '../VirtualList/VirtualList';
import { VirtualGrid } from '../VirtualList/VirtualGrid';

import { useFilterListProvider } from './hooks';

export const FilterListDataDisplayName = 'FilterListData';

export interface FilterListDataProps<T> {
  data: T[];
  renderElement: (data: T, i: number) => React.ReactNode;
  matcherFunc: (data: T, searchString: string) => boolean;
  gap?: number; // Gap in pixels between items
  overscan?: number; // How many items to preload when scrolling
  grid?: boolean;
  estimateSize?: number;
}

export function FilterListData<T>({
  data,
  renderElement,
  matcherFunc,
  gap,
  estimateSize,
  overscan,
  grid
}: FilterListDataProps<T>) {
  const { searchString, showFavorites } = useFilterListProvider();

  // Memoizing this function so we don't need to recreate it when
  // the renderElement function changes
  const filteredElements = useMemo(
    () => data.filter((e) => matcherFunc(e, searchString)),
    [searchString, matcherFunc, data]
  );

  return (
    !showFavorites &&
    (grid ? (
      <VirtualGrid
        data={filteredElements}
        renderElement={renderElement}
        estimateSize={estimateSize}
      />
    ) : (
      <VirtualList
        data={filteredElements}
        renderElement={renderElement}
        gap={gap}
        overscan={overscan}
        estimateSize={estimateSize}
      />
    ))
  );
}
