import { PropsWithChildren } from 'react';
import { ScrollArea } from '@mantine/core';

import { useFilterListProvider } from './FilterListProvider';

export const FilterListFavoritesDisplayName = 'FilterListFavorites';

export function FilterListFavorites({ children }: PropsWithChildren) {
  const { showFavorites } = useFilterListProvider();
  return (
    showFavorites && (
      <ScrollArea.Autosize
        scrollbars={'y'}
        type={'always'}
        offsetScrollbars
        mah={'100%'}
        mb={'var(--mantine-spacing-md)'}
      >
        {children}
      </ScrollArea.Autosize>
    )
  );
}

FilterListFavorites.displayName = FilterListFavoritesDisplayName;
