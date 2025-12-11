import { PropsWithChildren } from 'react';

import { PlusIcon } from '@/icons/icons';
import { Box, getSize, MantineSize } from '@mantine/core';

interface Props extends PropsWithChildren {
  decoration?: React.ReactNode;
  position?: 'top-left' | 'top-right';
  size?: MantineSize;
}

export function DecoratedIcon({
  children,
  decoration = <PlusIcon />,
  position = 'top-right',
  size = 'sm'
}: Props) {
  console.log(getSize(size));
  function positionStyle() {
    // switch (position) {
    //   case 'top-left':
    //     return {};
    // }
  }
  return (
    <Box
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 14,
        height: 14
      }}
    >
      {children}
      <Box
        style={{
          position: 'absolute',
          top: -4,
          right: -4
        }}
        size={8}
      >
        {decoration}
      </Box>
    </Box>
  );
}
