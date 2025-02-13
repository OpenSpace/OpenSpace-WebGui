import { useContext, useRef } from 'react';

import { FilterListContext, FilterListProviderProps } from './FilterListContext';

export function useFilterListProvider() {
  const context = useContext(FilterListContext) as FilterListProviderProps;
  if (!context) {
    throw Error('useFilterListProvider must be used within a FilterListProvider');
  }
  return context;
}

/**
 * Generates a function that calculates the available height for the `FilterList`
 * omponent
 *
 * @param minHeight The minimum height the `FilterList` can be
 * @param bottomMargin The margin from `FilterList` to the bottom of the panel, this value
 * is subtracted from the total `FilterList` height and is not to be confused with css
 * margin
 *
 * @returns An object containing:
 * - `ref` -  A reference to a sibling HTML element of `FilterList`, used to determine the
 * available space within the parent container
 * - `heightFunction` - Generated function that calculates the appropriate height, to be
 * passed to `FilterList` component*/
export function useComputeHeightFunction(minHeight: number, bottomMargin?: number) {
  const siblingRef = useRef<HTMLDivElement | null>(null);

  const heightFunction = (windowHeight: number): number => {
    const siblingHeight = siblingRef.current?.clientHeight;
    // A fallback option in case we don't know about our siblings height
    if (siblingHeight === undefined) {
      return windowHeight * 0.5;
    }

    const margin = bottomMargin ?? 0;
    const filterListHeight = windowHeight - siblingHeight - margin;
    return Math.max(filterListHeight, minHeight);
  };

  return { ref: siblingRef, heightFunction };
}
