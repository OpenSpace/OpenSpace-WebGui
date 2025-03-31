import { Flex, FlexProps } from '@mantine/core';

import { FixedContent } from './FixedContent';
import { GrowingContent } from './GrowingContent';

export function Layout({ children, ...props }: FlexProps) {
  return (
    <Flex direction={'column'} h={'100%'} wrap={'nowrap'} {...props}>
      {children}
    </Flex>
  );
}

Layout.FixedSection = FixedContent;
Layout.GrowingSection = GrowingContent;
