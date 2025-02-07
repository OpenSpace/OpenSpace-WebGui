import { KeyType, VirtualGrid } from '@/components/VirtualList/VirtualGrid';
import { useSearch } from './hooks';
import { SearchResultsProps } from '@/types/types';

export interface Props<T> extends SearchResultsProps<T> {
  gap?: number; // Gap in pixels between items
  overscan?: number; // How many items to preload when scrolling
  estimateSize?: number;
  columns?: number;
  keyFunc: (element: T) => string;
}

export function SearchResultsVirtualGrid<T extends KeyType>({
  data,
  renderElement,
  matcherFunc,
  gap,
  overscan,
  columns,
  keyFunc
}: Props<T>) {
  const filteredElements = useSearch(matcherFunc, data);

  return (
    <VirtualGrid
      data={filteredElements}
      renderElement={renderElement}
      gap={gap}
      overscan={overscan}
      columns={columns}
      keyFunc={keyFunc}
    />
  );
}
