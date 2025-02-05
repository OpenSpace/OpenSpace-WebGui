import { useMemo } from 'react';

import { useFilterListProvider } from '../hooks';

export function useSearch<T>(
  matcherFunc: (element: T, searchString: string) => boolean,
  data: T[]
) {
  const { searchString } = useFilterListProvider();

  // Memoizing this function so we don't need to recreate it when
  // the renderElement function changes
  const filteredElements = useMemo(
    () => data.filter((e) => matcherFunc(e, searchString)),
    [searchString, matcherFunc, data]
  );
  return filteredElements;
}
