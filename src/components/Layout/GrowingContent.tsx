import { PropsWithChildren } from 'react';
import { BoxProps } from '@mantine/core';

import { ScrollBox } from '../ScrollBox/ScrollBox';

export function GrowingContent({ children, ...props }: PropsWithChildren & BoxProps) {
  return (
    <ScrollBox flex={1} {...props}>
      {children}
    </ScrollBox>
  );
}
