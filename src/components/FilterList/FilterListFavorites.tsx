import { PropsWithChildren } from 'react';
import { Box } from '@mantine/core';

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
      <Box style={{ overflow: 'auto' }} mah={'100%'}>
        {children}
      </Box>
    )
  );
}

FilterListFavorites.displayName = FilterListFavoritesDisplayName;
