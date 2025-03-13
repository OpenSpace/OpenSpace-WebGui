import { PropsWithChildren } from 'react';
import { Box, BoxProps } from '@mantine/core';
import { useElementSize } from '@mantine/hooks';

import { WindowSizeContext } from './WindowSizeContext';
import { ScrollBox } from '@/components/ScrollBox/ScrollBox';

export function WindowSizeProvider({ children, ...props }: PropsWithChildren & BoxProps) {
  const { ref, width, height } = useElementSize();

  function disablePointerEvents(): void {
    if (!ref.current) {
      return;
    }
    ref.current.style.pointerEvents = 'none';
    ref.current.style.userSelect = 'none';
  }

  function enablePointerEvents(): void {
    if (!ref.current) {
      return;
    }
    ref.current.style.removeProperty('user-select');
    ref.current.style.removeProperty('pointer-events');
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
      <ScrollBox h={'100%'} ref={ref} p={'xs'} {...props}>
        {children}
      </ScrollBox>
    </WindowSizeContext.Provider>
  );
}
