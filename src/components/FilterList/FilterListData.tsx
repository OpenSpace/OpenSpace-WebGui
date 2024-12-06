
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

  const filteredElements = data.filter((e) => matcherFunc(e, searchString));

  return (
    !showFavorites && (
      <VirtualList data={filteredElements} renderElement={renderElement} />
    )
  );
}
