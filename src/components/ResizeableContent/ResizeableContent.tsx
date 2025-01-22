import {
  PropsWithChildren,
  TouchEvent as ReactTouchEvent,
  useCallback,
  useRef,
  useState
} from 'react';
import { MdDragHandle } from 'react-icons/md';
import { Box, Divider, MantineStyleProps, Stack } from '@mantine/core';

import { useWindowSize } from '@/windowmanagement/Window/hooks';

interface Props extends PropsWithChildren, MantineStyleProps {
  minHeight?: number;
  defaultHeight: number;
}

export function ResizeableContent({
  minHeight = 10,
  defaultHeight,
  children,
  ...props
}: Props) {
  const [height, setHeight] = useState(defaultHeight);
  const { pointerEvents: windowPointer } = useWindowSize();

  const contentRef = useRef<HTMLDivElement>(null);
  const resizerRef = useRef<HTMLDivElement>(null);

  const updateCursor = useCallback(() => {
    document.body.style.cursor = 'row-resize';
    // Disable highlight of the window content when dragging
    windowPointer.disable();
  }, [windowPointer]);

  const resetCursor = useCallback(() => {
    document.body.style.removeProperty('cursor');
    // Reset the regular behaviour of the window
    windowPointer.enable();
  }, [windowPointer]);

  const setHeightClamped = useCallback(
    (newHeight: number) => {
      setHeight(Math.max(newHeight, minHeight));
    },
    [minHeight]
  );

  const handleMouseDown = useCallback(
    (x: number, y: number) => {
      const startPos = {
        x: x,
        y: y
      };
      const currentFirstHeight = contentRef.current?.clientHeight;

      const handleMouseMove = (e: MouseEvent) => {
        if (!currentFirstHeight) {
          return;
        }
        const dy = e.clientY - startPos.y;
        const newHeight = currentFirstHeight + dy;
        setHeightClamped(newHeight);
        updateCursor();
      };

      const handleMouseUp = () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        resetCursor();
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    },
    [contentRef, setHeightClamped, resetCursor, updateCursor]
  );

  const handleTouchStart = useCallback(
    (e: ReactTouchEvent) => {
      const startPos = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY
      };
      const currentFirstHeight = contentRef.current?.clientHeight;

      const handleTouchMove = (e: TouchEvent) => {
        if (!currentFirstHeight) {
          return;
        }
        // Prevent scrolling when dragging
        e.preventDefault();

        const [touch] = e.touches;
        const dy = touch.clientY - startPos.y;
        const newHeight = currentFirstHeight + dy;
        setHeightClamped(newHeight);
        updateCursor();
      };

      const handleTouchEnd = () => {
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
        resetCursor();
      };
      // To block scrolling we need to have an active listener, not passive
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd);
    },
    [contentRef, setHeightClamped, resetCursor, updateCursor]
  );

  return (
    <>
      <Box ref={contentRef} style={{ height: height }}>
        {children}
      </Box>
      <Stack
        ref={resizerRef}
        onMouseDown={(e) => handleMouseDown(e.clientX, e.clientY)}
        onTouchStart={handleTouchStart}
        style={{
          cursor: 'row-resize'
        }}
        gap={0}
        {...props}
      >
        <Divider />
        <MdDragHandle size={20} style={{ marginLeft: 'auto', marginRight: 'auto' }} />
        <Divider />
      </Stack>
    </>
  );
}
