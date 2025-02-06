import { Grid, GridColProps } from '@mantine/core';

import { useWindowSize } from '@/windowmanagement/Window/hooks';

import { useDynamicGridProvider } from './hooks';

export function DynamicGridColumn({ children, span, ...props }: GridColProps) {
  const { width } = useWindowSize();
  const { minChildSize, nColumns } = useDynamicGridProvider();

  const columns = computeNCols();

  function computeNCols() {
    // Compute how many columns this element should span
    const childrenPerRow = Math.max(Math.floor(width / minChildSize), 1);
    return Math.ceil(nColumns / childrenPerRow);
  }

  return (
    <Grid.Col span={span ?? columns} {...props}>
      {children}
    </Grid.Col>
  );
}
