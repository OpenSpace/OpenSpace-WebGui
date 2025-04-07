import { PropsWithChildren } from 'react';
import { MantineStyleProps, Paper } from '@mantine/core';

interface Props extends PropsWithChildren, MantineStyleProps {
  withBorder?: boolean;
}

// This component is designed to be used as a wrapper for buttons in the Getting Started Panel
// for buttons that we only want to displat "as an image", i.e. show what they look like
// without actually being clickable.
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
