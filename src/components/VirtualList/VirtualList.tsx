import { useRef } from 'react';
import { Box, MantineSpacing } from '@mantine/core';
import { useVirtualizer } from '@tanstack/react-virtual';

export interface VirtualListProps<T> {
  data: T[];
  renderElement: (data: T, i: number) => React.ReactNode;
  gap?: MantineSpacing; // Gap in pixels between items
  overscan?: number; // How many items to preload when scrolling
}

// This component is copied from this tutorial and customized to fit
// our needs: https://tanstack.com/virtual/latest/docs/framework/react/examples/dynamic
export function VirtualList<T>({
  data,
  renderElement,
  gap,
  overscan
}: VirtualListProps<T>) {
  // The scrollable element for the list
  const parentRef = useRef<HTMLDivElement>(null);

  // The virtualizer
  const virtualizer = useVirtualizer({
    count: data.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 45,
    enabled: true,
    overscan: overscan
  });

  const items = virtualizer.getVirtualItems();

  // @TODO 2024-12-06 ylvse: style the scrollbar.
  return (
    <>
      {/* The scrollable element for your list */}
      <Box
        ref={parentRef}
        h={'100%'}
        w={'100%'}
        style={{
          overflow: 'auto'
        }}
        pr={'xs'}
      >
        {/* The large inner element to hold all of the items */}
        <Box h={`${virtualizer.getTotalSize()}px`} pos={'relative'} w={'100%'}>
          <Box
            pos={'absolute'}
            top={0}
            left={0}
            w={'100%'}
            style={{
              transform: `translateY(${items[0]?.start ?? 0}px)`
            }}
          >
            {/* The visible items, manually positioned to be in view */}
            {items.map((virtualRow) => (
              <Box
                ref={virtualizer.measureElement}
                key={virtualRow.key}
                data-index={virtualRow.index}
                pb={gap}
              >
                {renderElement(data[virtualRow.index], virtualRow.index)}
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </>
  );
}
