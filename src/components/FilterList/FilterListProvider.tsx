import { Children, isValidElement, PropsWithChildren, useState } from 'react';

import { FilterListContext } from './FilterListContext';
import { FilterListFavoritesDisplayName } from './FilterListFavorites';

function isFilterListFavorites(child: React.ReactNode) {
  if (!isValidElement(child)) {
    return false;
  }
  return (
    (child.type as React.ComponentType).displayName === FilterListFavoritesDisplayName
  );
}

interface Props extends PropsWithChildren {
  isLoading?: boolean;
}

export function FilterListProvider({ isLoading = false, children }: Props) {
  const [searchString, setSearchString] = useState('');
  const [showDataInstead, setShowDataInstead] = useState(false);
  const isSearching = searchString !== '';

  // See if favorites are among children
  const hasFavorites = Boolean(
    Children.toArray(children).find((child) => isFilterListFavorites(child))
  );
  const showFavorites = !isSearching && hasFavorites && !showDataInstead;

  function toggleShowDataInstead() {
    setShowDataInstead((current) => !current);
  }

  return (
    <FilterListContext.Provider
      value={{
        searchString,
        setSearchString,
        showFavorites,
        toggleShowDataInstead,
        showDataInstead,
        isLoading
      }}
    >
      {children}
    </FilterListContext.Provider>
  );
}
