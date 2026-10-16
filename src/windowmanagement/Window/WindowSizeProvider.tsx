import { PropsWithChildren, useRef } from 'react';
import { BoxProps } from '@mantine/core';
import { useElementSize, useMergedRef } from '@mantine/hooks';

import { ScrollBox } from '@/components/ScrollBox/ScrollBox';

import { WindowSizeContext } from './WindowSizeContext';

export function WindowSizeProvider({ children, ...props }: PropsWithChildren & BoxProps) {
  const { ref: sizeRef, width, height } = useElementSize();
  const elementRef = useRef<HTMLDivElement | null>(null);
  const ref = useMergedRef(sizeRef, elementRef);

  function disablePointerEvents(): void {
    if (!elementRef.current) {
      return;
    }
    elementRef.current.style.pointerEvents = 'none';
    elementRef.current.style.userSelect = 'none';
  }

  function enablePointerEvents(): void {
    if (!elementRef.current) {
      return;
    }
    elementRef.current.style.removeProperty('user-select');
    elementRef.current.style.removeProperty('pointer-events');
  }

  return (
    <WindowSizeContext.Provider
      value={{
        // Sometimes these values are 0 just when opening a window which can lead to strange
        // behaviour if there are calculations depending on these values. Mitigating this with
        // a dummy value
        width: width === 0 ? 300 : width,
        height: height === 0 ? 300 : height,
        pointerEvents: { enable: enablePointerEvents, disable: disablePointerEvents }
      }}
    >
      <ScrollBox h={'100%'} ref={ref} p={'xs'} {...props} direction={'both'}>
        {children}
      </ScrollBox>
    </WindowSizeContext.Provider>
  );
}
