import { PropsWithChildren } from 'react';

export const FilterListFavoritesDisplayName = 'FilterListFavorites';

export function FilterListFavorites({ children }: PropsWithChildren) {
  return <div>{children}</div>;
}

FilterListFavorites.displayName = FilterListFavoritesDisplayName;
