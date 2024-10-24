import { PropsWithChildren } from 'react';
import { ScrollArea } from '@mantine/core';

export const FilterListFavoritesDisplayName = 'FilterListFavorites';

export function FilterListFavorites({ children }: PropsWithChildren) {
  return (
    <ScrollArea.Autosize
      scrollbars={'y'}
      type={'always'}
      offsetScrollbars
      mah={'100%'}
      mb={'var(--mantine-spacing-md)'}
    >
      {children}
    </ScrollArea.Autosize>
  );
}

FilterListFavorites.displayName = FilterListFavoritesDisplayName;
