import { useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';

export interface VirtualListProps<T> {
  data: T[];
  renderElement: (data: T, i: number) => React.ReactNode;
  gap?: number; // Gap in pixels between items
  overscan?: number; // How many items to preload when scrolling
}

// This component is created from the example in the docs:
// https://tanstack.com/virtual/latest/docs/introduction
export function VirtualList<T>({
  data,
  renderElement,
  gap,
  overscan
}: VirtualListProps<T>) {
  // The scrollable element for the list
  const parentRef = useRef(null);

  // The virtualizer
  const rowVirtualizer = useVirtualizer({
    count: data.length,
    getScrollElement: () => parentRef.current,
    // This is the largest estimated size tanstack seems to be able to handle
    estimateSize: () => 35,
    overscan: overscan ?? 10,
    gap: gap ?? 5
  });

  // @TODO 2024-12-06 ylvse: style the scrollbar. Mantines scrollbar has a
  // completely separate component for the actual scrollbar which is not exported.
  // We could copy the source code but leaving this as is for now.
  // ScrollArea doesn't work with the virtual list and its a pretty
  // complex component so it's hard to just copy the styles
  return (
    <>
      {/* The scrollable element for your list */}
      <div
        ref={parentRef}
        style={{
          height: `100%`,
          width: `100%`,
          overflow: 'auto'
        }}
      >
        {/* The large inner element to hold all of the items */}
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            position: 'relative'
          }}
        >
          {/* Only the visible items in the virtualizer,
          manually positioned to be in view */}
          {rowVirtualizer.getVirtualItems().map((virtualRow) => (
            <div
              key={virtualRow.index}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: `${virtualRow.size}px`,
                transform: `translateY(${virtualRow.start}px)`
              }}
            >
              {renderElement(data[virtualRow.index], virtualRow.index)}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
