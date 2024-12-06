import { useMemo } from 'react';

import { VirtualList } from '../VirtualList/VirtualList';

import { useFilterListProvider } from './hooks';

export const FilterListDataDisplayName = 'FilterListData';

export interface FilterListDataProps<T> {
  data: T[];
  renderElement: (data: T) => React.ReactNode;
  matcherFunc: (data: T, searchString: string) => boolean;
}

export function FilterListData<T>({
  data,
  renderElement,
  matcherFunc
}: FilterListDataProps<T>) {
  const { searchString, showFavorites } = useFilterListProvider();

  // Memoizing this function so we don't need to recreate it when
  // the renderElement function changes
  const filteredElements = useMemo(
    () => data.filter((e) => matcherFunc(e, searchString)),
    [searchString, matcherFunc, data]
  );

  return (
    !showFavorites && (
      <VirtualList data={filteredElements} renderElement={renderElement} />
    )
  );
}
