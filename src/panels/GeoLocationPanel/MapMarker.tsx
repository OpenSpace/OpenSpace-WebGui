import { Box } from '@mantine/core';
import { PropsWithChildren } from 'react';

interface Props extends PropsWithChildren {
  left: number | string;
  top: number | string;
}

export function MapMarker({ left, top, children }: Props) {
  return (
    <Box
      style={{
        position: 'absolute',
        left,
        top,
        transform: 'translate(-50%, -50%)'
      }}
    >
      {children}
    </Box>
  );
}
