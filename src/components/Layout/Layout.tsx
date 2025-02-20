import { PropsWithChildren } from 'react';
import { Container, ContainerProps } from '@mantine/core';
import { useElementSize } from '@mantine/hooks';

import { FixedContent } from './FixedContent';
import { GrowingContent } from './GrowingContent';
import { LayoutContext } from './LayoutContext';

export function Layout({ children, ...props }: ContainerProps & PropsWithChildren) {
  const { ref: parentRef, height: parentHeight } = useElementSize();
  const { ref: fixedContentRef, height: fixedContentHeight } = useElementSize();

  return (
    <LayoutContext.Provider
      value={{
        growingSizeHeight: parentHeight - fixedContentHeight,
        ref: fixedContentRef
      }}
    >
      <Container ref={parentRef} h={'100%'} {...props} px={'xs'} py={'md'}>
        {children}
      </Container>
    </LayoutContext.Provider>
  );
}

Layout.FixedSection = FixedContent;
Layout.GrowingSection = GrowingContent;
