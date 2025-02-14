import { useMemo } from 'react';
import { Box, MantineSpacing, SimpleGrid } from '@mantine/core';

import { VirtualList } from './VirtualList';

export interface KeyType {
  key: string;
}

interface Props<T extends KeyType> {
  data: T[];
  renderElement: (data: T, i: number) => React.ReactNode;
  gap?: MantineSpacing; // Gap inbetween items
  overscan?: number; // How many items to preload when scrolling
  columns?: number;
}

export function VirtualGrid<T extends KeyType>({
  data,
  renderElement,
  gap,
  overscan,
  columns = 3
}: Props<T>) {
  // Create a new array with n no of data entries per entry, where n == columns
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
      overscan={overscan}
      renderElement={(row, iRow) => (
        <SimpleGrid cols={columns} spacing={gap}>
          {row?.map((element, iCol) => (
            <Box key={`row${iRow}${iCol}`}>{renderElement(element, iRow + iCol)}</Box>
          ))}
        </SimpleGrid>
      )}
    />
  );
}
