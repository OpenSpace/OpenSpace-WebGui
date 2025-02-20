import { PropsWithChildren } from 'react';
import { Box, BoxProps } from '@mantine/core';
import { useElementSize } from '@mantine/hooks';

import { FixedContent } from './FixedContent';
import { GrowingContent } from './GrowingContent';
import { LayoutContext } from './LayoutContext';

export function Layout({ children, ...props }: BoxProps & PropsWithChildren) {
  const { ref: parentRef, height: parentHeight } = useElementSize();
  const { ref: fixedContentRef, height: fixedContentHeight } = useElementSize();

  return (
    <LayoutContext.Provider
      value={{
        growingSizeHeight: parentHeight - fixedContentHeight,
        ref: fixedContentRef
      }}
    >
      <Box ref={parentRef} h={'100%'} {...props}>
        {children}
      </Box>
    </LayoutContext.Provider>
  );
}

Layout.FixedSection = FixedContent;
Layout.GrowingSection = GrowingContent;
