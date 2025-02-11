import { VirtualList } from '../../VirtualList/VirtualList';

import { useSearchResultProvider } from './hooks';

interface VirtualizedProps {
  gap?: number; // Gap in pixels between items
  overscan?: number; // How many items to preload when scrolling
}

export function SearchResultsVirtualList<T>({ gap, overscan }: VirtualizedProps) {
  const { filteredItems, renderElement } = useSearchResultProvider<T>();

  return (
    <VirtualList
      data={filteredItems}
      renderElement={renderElement}
      gap={gap}
      overscan={overscan}
    />
  );
}
