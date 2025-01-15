import { ScrollArea } from '@mantine/core';

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
      <>
        {filteredElements.length > 0
          ? filteredElements.map(renderElement)
          : 'Nothing found. Try another search!'}
      </>
    )
  );
}
