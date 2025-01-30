import { useMemo } from 'react';
import { Grid } from '@mantine/core';

import { VirtualList } from './VirtualList';

export interface KeyType {
  key: string;
}
export interface VirtualGridProps<T extends KeyType> {
  data: T[];
  renderElement: (data: T, i: number) => React.ReactNode;
  gap?: number; // Gap in pixels between items
  overscan?: number; // How many items to preload when scrolling
  columns?: number;
  estimateSize?: number;
}

// This component is created from the example in the docs:
// https://tanstack.com/virtual/latest/docs/introduction
export function VirtualGrid<T extends KeyType>({
  data,
  renderElement,
  gap,
  overscan,
  columns = 3,
  estimateSize
}: VirtualGridProps<T>) {
  // Create a new array with n no of data entries per entry,
  // where n == columns
  const dataByColumns = useMemo(() => {
    const result: T[][] = [];
    for (let i = 0; i < data.length; i += columns) {
      result.push(data.slice(i, i + columns));
    }
    return result;
  }, [data, columns]);

  return (
    <VirtualList
      data={dataByColumns}
      gap={gap}
      estimateSize={estimateSize}
      overscan={overscan}
      renderElement={(d, i) => (
        <Grid key={`grid${i}`}>
          {d?.map((el, j) => (
            <Grid.Col key={el.key} span={12 / columns}>
              {renderElement(el, i + j)}
            </Grid.Col>
          ))}
        </Grid>
      )}
    />
  );
}
