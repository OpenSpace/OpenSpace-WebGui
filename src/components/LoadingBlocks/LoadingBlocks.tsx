import { useMemo } from 'react';
import { Skeleton, Stack } from '@mantine/core';

interface Props {
  n?: number;
}

export function LoadingBlocks({ n = 4 }: Props) {
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
    <Stack>
      {widths.map((width, i) => (
        <Skeleton key={i} height={16} width={width} />
      ))}
    </Stack>
  );
}
