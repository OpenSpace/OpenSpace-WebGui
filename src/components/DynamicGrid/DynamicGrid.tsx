import { PropsWithChildren } from 'react';
import { SimpleGrid, SimpleGridProps } from '@mantine/core';

import { useWindowSize } from '@/windowmanagement/Window/hooks';

interface Props extends SimpleGridProps, PropsWithChildren {
  minChildSize: number; // The minimum a child column can be before it will row break
  gridWidth?: number; // The available width of this grid
}

export function DynamicGrid({ minChildSize, gridWidth, children, ...props }: Props) {
  const { width: panelWidth } = useWindowSize();

  function computeNCols() {
    const width = gridWidth ?? panelWidth;
    // Compute how many columns this element should span
    const childrenPerRow = Math.max(Math.floor(width / minChildSize), 1);
    return childrenPerRow;
  }

  return (
    <SimpleGrid cols={computeNCols()} {...props}>
      {children}
    </SimpleGrid>
  );
}
