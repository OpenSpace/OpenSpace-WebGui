import { PropsWithChildren } from 'react';
import { Box, BoxProps } from '@mantine/core';

import { useLayoutProvider } from './hooks';

export function FixedContent({ children, ...props }: PropsWithChildren & BoxProps) {
  const { ref } = useLayoutProvider();

  return (
    <Box ref={ref} {...props}>
      {children}
    </Box>
  );
}
