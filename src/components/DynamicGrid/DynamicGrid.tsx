import { PropsWithChildren } from 'react';
import { SimpleGrid, SimpleGridProps } from '@mantine/core';

import { useWindowSize } from '@/windowmanagement/Window/hooks';

interface Props extends SimpleGridProps, PropsWithChildren {
  minChildSize: number; // The minimum a child column can be before it will row break
  gridWidth?: number; // The available width of this grid
  maxCols?: number; // The maximum number of columns to use
}

export function DynamicGrid({
  minChildSize,
  gridWidth,
  children,
  maxCols,
  ...props
}: Props) {
  const { width: panelWidth } = useWindowSize();

  function computeNCols() {
    // Compute how many columns the grid should have
    const width = gridWidth ?? panelWidth;
    //
    const childrenPerRow = Math.max(Math.floor(width / minChildSize), 1);
    if (maxCols !== undefined) {
      return Math.min(childrenPerRow, maxCols);
    }
    return childrenPerRow;
  }

  return (
    <SimpleGrid cols={computeNCols()} {...props}>
      {children}
    </SimpleGrid>
  );
}
