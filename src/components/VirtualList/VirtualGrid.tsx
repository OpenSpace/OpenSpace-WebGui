import { useMemo } from 'react';
import { VirtualList } from './VirtualList';
import { Grid } from '@mantine/core';

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
  const dataByColumns = useMemo(() => {
    return data
      .map((d, i, array) => {
        if (i % columns) {
          let row = [];
          for (let j = 0; j < columns; j++) {
            if (array.length > i + j) {
              row.push(array[i + j]);
            }
          }
          return row.filter((el) => el);
        }
        return undefined;
      })
      .filter((d) => d?.filter((el) => el));
  }, [data]);

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
