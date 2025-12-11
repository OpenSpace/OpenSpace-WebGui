import { PropsWithChildren } from 'react';
import { Box, MantineSize } from '@mantine/core';

import { PlusIcon } from '@/icons/icons';
import { IconSize } from '@/types/enums';

type DecoratorPosition = 'top-left' | 'top-right';

interface Props extends PropsWithChildren {
  decorator?: React.ReactNode;
  position?: DecoratorPosition;
  size?: MantineSize;
}

const MappedWrapperSize: Record<MantineSize, number> = {
  xs: IconSize.xs,
  sm: IconSize.sm,
  md: IconSize.md,
  lg: IconSize.lg,
  xl: IconSize.xl
};

const MappedDecoratorPosition: Record<MantineSize, { x: number; y: number }> = {
  xs: { x: 6, y: 12 },
  sm: { x: 6, y: 10 },
  md: { x: 6, y: 8 },
  lg: { x: 6, y: 6 },
  xl: { x: 6, y: 4 }
};

const MappedDecoratorSize: Record<MantineSize, number> = {
  xs: 9,
  sm: 9,
  md: 10,
  lg: 10,
  xl: 12
};

export function DecoratedIcon({
  children,
  decorator,
  position = 'top-right',
  size = 'xs'
}: Props) {
  const wrapperSize = MappedWrapperSize[size];
  const { x: offsetX, y: offestY } = MappedDecoratorPosition[size];

  const mappedDecoratorPositionCSS: Record<DecoratorPosition, React.CSSProperties> = {
    'top-left': { top: -offestY, left: -offsetX },
    'top-right': { top: -offestY, right: -offsetX }
  };

  return (
    <Box
      pos={'relative'}
      display={'flex'}
      w={wrapperSize}
      h={wrapperSize}
      style={{
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      {children}
      <Box pos={'absolute'} style={mappedDecoratorPositionCSS[position]}>
        {decorator ?? <PlusIcon size={MappedDecoratorSize[size]} />}
      </Box>
    </Box>
  );
}
