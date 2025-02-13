import { KeyType, VirtualGrid } from '@/components/VirtualList/VirtualGrid';

import { useSearchResultProvider } from './hooks';

export interface Props {
  gap?: number; // Gap in pixels between items
  overscan?: number; // How many items to preload when scrolling
  columns?: number;
}

export function SearchResultsVirtualGrid<T extends KeyType>({
  gap,
  overscan,
  columns
}: Props) {
  const { filteredItems, renderElement } = useSearchResultProvider<T>();

  return (
    <VirtualGrid
      data={filteredItems}
      renderElement={renderElement}
      gap={gap}
      overscan={overscan}
      columns={columns}
    />
  );
}
