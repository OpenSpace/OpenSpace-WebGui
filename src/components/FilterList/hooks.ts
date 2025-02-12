import { useContext, useRef } from 'react';

import { FilterListContext } from './FilterListContext';

export function useFilterListProvider() {
  const context = useContext(FilterListContext);
  if (!context) {
    throw Error('useFilterListProvider must be used within a FilterListProvider');
  }
  return context;
}

export function useGenerateHeightFunction(minHeight: number, bottomMargin?: number) {
  const ref = useRef<HTMLDivElement | null>(null);

  const heightFunction = (windowHeight: number): number => {
    const siblingHeight = ref.current?.clientHeight;
    // A fallback option in case we don't know about our siblings height
    if (siblingHeight === undefined) {
      return windowHeight * 0.5;
    }

    const margin = bottomMargin ?? 0;
    const filterListHeight = windowHeight - siblingHeight - margin;
    return Math.max(filterListHeight, minHeight);
  };

  return { ref, heightFunction };
}
