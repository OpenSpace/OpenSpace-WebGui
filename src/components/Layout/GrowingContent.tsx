import { PropsWithChildren } from 'react';
import { Box, BoxProps } from '@mantine/core';

import { useLayoutProvider } from './hooks';

export function GrowingContent({ children, ...props }: PropsWithChildren & BoxProps) {
  const { growingSizeHeight } = useLayoutProvider();

  return (
    <Box h={growingSizeHeight} {...props}>
      {children}
    </Box>
  );
}
