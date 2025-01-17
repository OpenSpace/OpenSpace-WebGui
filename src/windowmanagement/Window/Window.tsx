import { PropsWithChildren } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useDispatch } from 'react-redux';
import { ScrollArea } from '@mantine/core';
import { useElementSize } from '@mantine/hooks';

import { reloadPropertyTree } from '@/redux/propertytree/propertyTreeMiddleware';

import { fallbackRender } from '@/util/fallbackRenderer';
import { WindowSizeContext } from './WindowSizeContext';

export function Window({ children }: PropsWithChildren) {
  const { ref, width, height } = useElementSize();
  const dispatch = useDispatch();
  return (
    <WindowSizeContext.Provider
      value={{
        width: width,
        height: height
      }}
    >
      <ScrollArea h={'100%'} ref={ref}>
        <ErrorBoundary
          fallbackRender={fallbackRender}
          onReset={() => dispatch(reloadPropertyTree())}
        >
          {children}
        </ErrorBoundary>
      </ScrollArea>
    </WindowSizeContext.Provider>
  );
}
export { WindowSizeContext };
