import { PropsWithChildren } from 'react';
import { Grid, GridProps } from '@mantine/core';

import { DynamicGridColumn } from './DynamicGridColumn';
import { DynamicGridProvider } from './DynamicGridProvider';

interface Props extends GridProps, PropsWithChildren {
  minChildSize: number; // The minimum a child column can be before it will row break
  gridWidth?: number; // The available width of this grid
}

export function DynamicGrid({
  minChildSize,
  columns = 12,
  gridWidth,
  children,
  ...props
}: Props) {
  return (
    <Grid columns={columns} {...props}>
      <DynamicGridProvider
        minChildSize={minChildSize}
        columns={columns}
        gridWidth={gridWidth}
      >
        {children}
      </DynamicGridProvider>
    </Grid>
  );
}

DynamicGrid.Col = DynamicGridColumn;
