import { SearchResultsProps } from '@/types/types';
import { VirtualList } from '../../VirtualList/VirtualList';

import { useSearch } from './hooks';

interface VirtualizedProps<T> extends SearchResultsProps<T> {
  gap?: number; // Gap in pixels between items
  overscan?: number; // How many items to preload when scrolling
}

export function SearchResultsVirtualList<T>({
  data,
  renderElement,
  matcherFunc,
  gap,
  overscan
}: VirtualizedProps<T>) {
  const filteredElements = useSearch(matcherFunc, data);

  if (filteredElements.length === 0) {
    return <>No matches found. Try another search</>;
  }

  return (
    <VirtualList
      data={filteredElements}
      renderElement={renderElement}
      gap={gap}
      overscan={overscan}
    />
  );
}
