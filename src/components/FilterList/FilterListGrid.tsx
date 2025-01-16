import { useMemo } from 'react';

import { VirtualGrid } from '../VirtualList/VirtualGrid';

import { useFilterListProvider } from './hooks';

export const FilterListDataDisplayName = 'FilterListData';
import { KeyType } from '../VirtualList/VirtualGrid';

export interface FilterListGridProps<T> {
  data: T[];
  renderElement: (data: T, i: number) => React.ReactNode;
  matcherFunc: (data: T, searchString: string) => boolean;
  gap?: number; // Gap in pixels between items
  overscan?: number; // How many items to preload when scrolling
  grid?: boolean;
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
  // This is a performance bottleneck so memoize this
  const renderElementMemo = useMemo(() => renderElement, []);

  return (
    !showFavorites && (
      <VirtualGrid
        data={filteredElements}
        renderElement={renderElementMemo}
        estimateSize={estimateSize}
        gap={gap}
        overscan={overscan}
        columns={columns}
      />
    )
  );
}
