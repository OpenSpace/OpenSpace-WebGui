import { PropsWithChildren } from 'react';
import { ScrollArea } from '@mantine/core';

import { LoadingBlocks } from '../LoadingBlocks/LoadingBlocks';

import { useFilterListProvider } from './hooks';

export const FilterListFavoritesDisplayName = 'FilterListFavorites';

export function FilterListFavorites({ children }: PropsWithChildren) {
  const { showFavorites, isLoading } = useFilterListProvider();

  if (isLoading) {
    return <LoadingBlocks />;
  }

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
