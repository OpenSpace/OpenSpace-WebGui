import { Skeleton, Stack } from '@mantine/core';

interface Props {
  nBlocks: number;
  minWidthPercentage: number;
}

export function LoadingBlocks({ nBlocks, minWidthPercentage = 0 }: Props) {
  const min = minWidthPercentage;
  return (
    <Stack>
      {[...Array(nBlocks)].map((_, i) => (
        <Skeleton
          key={i}
          height={10}
          width={`${min + Math.random() * 100 * (1.0 - min / 100.0)}%`}
        />
      ))}
    </Stack>
  );
}
