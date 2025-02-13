import { Grid, GridColProps } from '@mantine/core';

import { useWindowSize } from '@/windowmanagement/Window/hooks';

import { useDynamicGridProvider } from './hooks';

export function DynamicGridColumn({ children, span, ...props }: GridColProps) {
  const { width: panelWidth } = useWindowSize();
  const { minChildSize, columns, gridWidth } = useDynamicGridProvider();

  const spanNColumns = computeNCols();

  function computeNCols() {
    const width = gridWidth ?? panelWidth;
    // Compute how many columns this element should span
    const childrenPerRow = Math.max(Math.floor(width / minChildSize), 1);
    return Math.ceil(columns / childrenPerRow);
  }

  return (
    <Grid.Col span={span ?? spanNColumns} {...props}>
      {children}
    </Grid.Col>
  );
}
