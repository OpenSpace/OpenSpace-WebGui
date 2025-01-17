import { PropsWithChildren } from 'react';
import { ScrollArea } from '@mantine/core';
import { useElementSize } from '@mantine/hooks';
import { WindowSizeContext } from './WindowSizeContext';

export function Window({ children }: PropsWithChildren) {
  const { ref, width, height } = useElementSize();
  return (
    <WindowSizeContext.Provider
      value={{
        width: width,
        height: height
      }}
    >
      <ScrollArea h={'100%'} ref={ref}>
        {children}
      </ScrollArea>
    </WindowSizeContext.Provider>
  );
}
export { WindowSizeContext };
