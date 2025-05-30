import { MantineSpacing } from '@mantine/core';

import { VirtualList } from '@/components/VirtualList/VirtualList';

import { useSearchResultProvider } from './hooks';

interface Props {
  gap?: MantineSpacing; // Gap in pixels between items
  overscan?: number; // How many items to preload when scrolling
}

export function SearchResultsVirtualList<T>({ gap, overscan }: Props) {
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
