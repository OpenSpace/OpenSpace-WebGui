import { PropsWithChildren } from 'react';
import { MantineStyleProps, Paper } from '@mantine/core';

interface Props extends PropsWithChildren, MantineStyleProps {
  withBorder?: boolean;
}

export function ButtonWrapper({ withBorder = false, children, ...styleProps }: Props) {
  return (
    <Paper
      mt={'md'}
      w={'fit-content'}
      withBorder={withBorder}
      bg={'transparent'}
      style={{ pointerEvents: 'none' }}
      {...styleProps}
    >
      {children}
    </Paper>
  );
}
