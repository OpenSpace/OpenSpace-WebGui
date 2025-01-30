import { useMemo } from 'react';

import { KeyType, VirtualGrid } from '../VirtualList/VirtualGrid';

import { useFilterListProvider } from './hooks';

export const FilterListDataDisplayName = 'FilterListData';

export interface FilterListGridProps<T> {
  data: T[];
  renderElement: (data: T, i: number) => React.ReactNode;
  matcherFunc: (data: T, searchString: string) => boolean;
  gap?: number; // Gap in pixels between items
  overscan?: number; // How many items to preload when scrolling
  estimateSize?: number;
  columns?: number;
}

export function FilterListGrid<T extends KeyType>({
  data,
  renderElement,
  matcherFunc,
  gap,
  estimateSize,
  overscan,
  columns
}: FilterListGridProps<T>) {
  const { searchString, showFavorites } = useFilterListProvider();

  // Memoizing this function so we don't need to recreate it when
  // the renderElement function changes
  const filteredElements = useMemo(
    () => data.filter((e) => matcherFunc(e, searchString)),
    [searchString, matcherFunc, data]
  );

  return (
    !showFavorites && (
      <VirtualGrid
        data={filteredElements}
        renderElement={renderElement}
        estimateSize={estimateSize}
        gap={gap}
        overscan={overscan}
        columns={columns}
      />
    )
  );
}
