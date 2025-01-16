import { useMemo } from 'react';

import { VirtualList } from '../VirtualList/VirtualList';

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
  overscan
}: FilterListDataProps<T>) {
  const { searchString, showFavorites } = useFilterListProvider();

  // Memoizing this function so we don't need to recreate it when
  // the renderElement function changes
  const filteredElements = useMemo(
    () => data.filter((e) => matcherFunc(e, searchString)),
    [searchString, matcherFunc, data]
  );

  // Memioze as this can be a performance bottleneck regarding re-renders
  const renderElementMemo = useMemo(() => renderElement, []);

  return (
    !showFavorites && (
      <VirtualList
        data={filteredElements}
        renderElement={renderElementMemo}
        gap={gap}
        overscan={overscan}
        estimateSize={estimateSize}
      />
    )
  );
}
