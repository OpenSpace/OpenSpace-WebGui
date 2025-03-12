import { PropsWithChildren } from 'react';
import { Box } from '@mantine/core';

import { LoadingBlocks } from '../LoadingBlocks/LoadingBlocks';

import { useFilterListProvider } from './hooks';
import { ScrollBox } from '../ScrollBox/ScrollBox';

export const FilterListFavoritesDisplayName = 'FilterListFavorites';

export function FilterListFavorites({ children }: PropsWithChildren) {
  const { showFavorites, isLoading } = useFilterListProvider();

  if (isLoading) {
    return <LoadingBlocks />;
  }

  return showFavorites && <ScrollBox mah={'100%'}>{children}</ScrollBox>;
}

FilterListFavorites.displayName = FilterListFavoritesDisplayName;
