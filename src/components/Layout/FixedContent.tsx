import { PropsWithChildren } from 'react';
import { Box, BoxProps } from '@mantine/core';

export function FixedContent({ children, ...props }: PropsWithChildren & BoxProps) {
  return (
    <Box flex={0} {...props}>
      {children}
    </Box>
  );
}
