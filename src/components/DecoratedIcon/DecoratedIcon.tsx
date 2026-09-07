import { PropsWithChildren } from 'react';
import {
  Box,
  MantineColor,
  MantineSize,
  ThemeIcon,
  ThemeIconVariant
} from '@mantine/core';

import { PlusIcon } from '@/icons/icons';
import { IconSize } from '@/types/enums';

type DecoratorPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

export interface DecoratedIconProps extends PropsWithChildren {
  /**
   * The icon to be used as the decorator. If not provided, a default plus icon will be used
   */
  decoratorIcon?: React.JSX.Element;

  /**
   * The variant of the decorator icon. Defaults to 'default'
   */
  decoratorVariant?: ThemeIconVariant;

  /**
   * The color of the decorator icon. Defaults to 'undefined'
   */
  decoratorColor?: MantineColor;

  /**
   * The position of the decorator icon relative to the base icon. Defaults to 'top-right'
   */
  position?: DecoratorPosition;

  /**
   * The size of the base icon. Defaults to 'xs'
   */
  size?: MantineSize;

  /**
   * An optional offset that may be used to adjust the position of the decorator icon
   */
  offset?: { x?: number; y?: number };

  /**
   * Whether the icon represents a disabled state. If true, the decorator icon will be
   * rendered with a disabled style. Defaults to false
   */
  disabled?: boolean;
}

const MappedWrapperSize: Record<MantineSize, number> = {
  xs: IconSize.xs,
  sm: IconSize.sm,
  md: IconSize.md,
  lg: IconSize.lg,
  xl: IconSize.xl
};

const MappedDecoratorSize: Record<MantineSize, number> = {
  xs: 8,
  sm: 9,
  md: 10,
  lg: 12,
  xl: 14
};

/**
 * Decorates an icon with a smaller icon in one of the corners. The decorator icon can be
 * customized, but defaults to a plus icon.
 */
export function DecoratedIcon({
  children,
  decoratorIcon,
  decoratorVariant = 'default',
  decoratorColor,
  position = 'top-right',
  size = 'xs',
  offset = { x: 0, y: 0 },
  disabled = false
}: DecoratedIconProps) {
  const wrapperSize = MappedWrapperSize[size];
  const decoratorSize = MappedDecoratorSize[size];
  const halfSize = wrapperSize / 2;

  const offsetX = offset.x ?? 0;
  const offsetY = offset.y ?? 0;

  // Place the decorator at each corner, offset to overlap by a certain amount based off
  // of the decorator size
  const overlapX = 0.3 * decoratorSize;
  const overlapY = 0.5 * decoratorSize;
  const overlapYBottom = 0.4 * decoratorSize;

  function buildAbsolutePosition(x: number, y: number) {
    return {
      top: '50%',
      left: '50%',
      transform: `translate(-50%, -50%) translate(${x}px, ${y}px)`
    };
  }

  const MappedDecoratorPositionCSS: Record<DecoratorPosition, React.CSSProperties> = {
    'top-left': buildAbsolutePosition(
      -halfSize + overlapX + offsetX,
      -halfSize + overlapY + offsetY
    ),
    'top-right': buildAbsolutePosition(
      halfSize - overlapX + offsetX,
      -halfSize + overlapY + offsetY
    ),
    'bottom-left': buildAbsolutePosition(
      -halfSize + overlapX + offsetX,
      halfSize - overlapYBottom + offsetY
    ),
    'bottom-right': buildAbsolutePosition(
      halfSize - overlapX + offsetX,
      halfSize - overlapYBottom + offsetY
    )
  };

  return (
    <Box pos={'relative'} w={wrapperSize} h={wrapperSize}>
      {children}
      <Box pos={'absolute'} style={MappedDecoratorPositionCSS[position]}>
        <ThemeIcon
          size={MappedDecoratorSize[size]}
          radius={'xs'}
          variant={decoratorVariant}
          color={decoratorColor}
          opacity={disabled ? 0.5 : 1}
        >
          {decoratorIcon || <PlusIcon />}
        </ThemeIcon>
      </Box>
    </Box>
  );
}
