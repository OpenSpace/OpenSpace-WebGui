import { PropsWithChildren } from 'react';

import { useFilterListProvider } from './hooks';

export const FilterListFavoritesDisplayName = 'FilterListFavorites';

export function FilterListFavorites({ children }: PropsWithChildren) {
  const { showFavorites } = useFilterListProvider();
  return showFavorites && <>{children}</>;
}

FilterListFavorites.displayName = FilterListFavoritesDisplayName;
