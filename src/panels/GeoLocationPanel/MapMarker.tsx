import { PropsWithChildren } from 'react';
import { Box } from '@mantine/core';

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
        transform: 'translate(-50%, -50%)',
        zIndex: 1000
      }}
    >
      {children}
    </Box>
  );
}
