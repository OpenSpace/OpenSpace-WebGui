import { useMemo } from 'react';
import { Skeleton, Stack, StackProps } from '@mantine/core';

interface Props extends StackProps {
  n?: number;
}

export function LoadingBlocks({ n = 4, ...props }: Props) {
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
    <Stack {...props}>
      {widths.map((width, i) => (
        <Skeleton key={i} height={16} width={width} />
      ))}
    </Stack>
  );
}
