import { PropsWithChildren } from 'react';
import { Box, MantineSize } from '@mantine/core';

import { PlusIcon } from '@/icons/icons';
import { IconSize } from '@/types/enums';

type DecoratorPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

interface Props extends PropsWithChildren {
  renderDecorator?: (size: number) => React.JSX.Element;
  position?: DecoratorPosition;
  size?: MantineSize;
  offset?: { x: number; y: number };
}

const MappedWrapperSize: Record<MantineSize, number> = {
  xs: IconSize.xs,
  sm: IconSize.sm,
  md: IconSize.md,
  lg: IconSize.lg,
  xl: IconSize.xl
};

const MappedDecoratorPosition: Record<MantineSize, { x: number; y: number }> = {
  xs: { x: 6, y: 10 },
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
  renderDecorator,
  position = 'top-right',
  size = 'xs',
  offset = { x: 0, y: 0 }
}: Props) {
  const wrapperSize = MappedWrapperSize[size];
  const { x: offsetX, y: offsetY } = MappedDecoratorPosition[size];

  const mappedDecoratorPositionCSS: Record<DecoratorPosition, React.CSSProperties> = {
    'top-left': { top: -offsetY + offset.y, left: -offsetX + offset.x },
    'top-right': { top: -offsetY + offset.y, right: -offsetX + offset.x },
    'bottom-left': { bottom: -offsetY + offset.y, left: -offsetX + offset.x },
    'bottom-right': { bottom: -offsetY + offset.y, right: -offsetX + offset.x }
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
        {renderDecorator ? (
          renderDecorator(MappedDecoratorSize[size])
        ) : (
          <PlusIcon size={MappedDecoratorSize[size]} />
        )}
      </Box>
    </Box>
  );
}
