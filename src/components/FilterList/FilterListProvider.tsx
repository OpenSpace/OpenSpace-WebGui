import { Children, isValidElement, useState } from 'react';

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

export function FilterListProvider({ children }: { children: React.ReactNode }) {
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
        showDataInstead
      }}
    >
      {children}
    </FilterListContext.Provider>
  );
}
