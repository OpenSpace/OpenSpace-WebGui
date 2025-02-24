import { useMemo } from 'react';
import { MantineStyleProps, Skeleton, Stack } from '@mantine/core';

interface Props extends MantineStyleProps {
  n?: number;
}

export function LoadingBlocks({ n = 4, ...styleProps }: Props) {
  const widths = useMemo(
    () =>
      [...Array(n)].map(() => {
        const min = 50;
        const max = 100;
        return `${Math.floor(Math.random() * (max - min + 1)) + min}%`;
      }),
    [n]
  );
  return (
    <Stack {...styleProps}>
      {widths.map((width, i) => (
        <Skeleton key={i} height={16} width={width} />
      ))}
    </Stack>
  );
}
