import { PropsWithChildren } from 'react';

import { LoadingBlocks } from '../LoadingBlocks/LoadingBlocks';
import { ScrollBox } from '../ScrollBox/ScrollBox';

import { useFilterListProvider } from './hooks';

export const FilterListFavoritesDisplayName = 'FilterListFavorites';

export function FilterListFavorites({ children }: PropsWithChildren) {
  const { showFavorites, isLoading } = useFilterListProvider();

  if (isLoading) {
    return <LoadingBlocks />;
  }

  return showFavorites && <ScrollBox mah={'100%'}>{children}</ScrollBox>;
}

FilterListFavorites.displayName = FilterListFavoritesDisplayName;
