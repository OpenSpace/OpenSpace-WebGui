import { useState } from 'react';
import { useMergedRef, useResizeObserver } from '@mantine/hooks';

/**
 * Hook that determines whether the content of an element is truncated (clipped by
 * overflow). The element is considered truncated if its scrollable size is larger than its
 * visible size, in either direction. The component using the hook rerenders when the
 * element is resized, so the result stays up to date.
 *
 * @template T The type of the HTML element to measure.
 * @returns An object with:
 * - `ref`: A callback ref that must be attached to the element to measure.
 * - `isTruncated`: True if the element's content is truncated. False if it is not, or if
 *   the element has not been mounted yet.
 *
 * @example
 * const { ref, isTruncated } = useIsTruncated<HTMLDivElement>();
 * return (
 *   <Tooltip disabled={!isTruncated}>
 *     <Text truncate ref={ref}>{text}</Text>
 *   </Tooltip>
 * );
 */
export function useIsTruncated<T extends HTMLElement>() {
  // resizeObserver triggers a re-render when the element is resized
  const [resizeRef] = useResizeObserver<T>();
  const [element, setElement] = useState<T | null>(null);
  const ref = useMergedRef(resizeRef, setElement);

  const isTruncated =
    !!element &&
    (element.scrollWidth > element.clientWidth ||
      element.scrollHeight > element.clientHeight);

  return { ref, isTruncated };
}
