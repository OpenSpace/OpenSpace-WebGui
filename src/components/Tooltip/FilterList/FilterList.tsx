import { TextInput } from '@mantine/core';
import { Children, cloneElement, isValidElement, useState } from 'react';
import { FilterListFavoritesDisplayName } from './FilterListFavorites';
import { FilterListDataDisplayName, FilterListDataProps } from './FilterListData';

const FilterListShowMoreButtonDisplayName = 'FilterListShowMoreButton';
interface FilterListProps {
  children: React.ReactNode;
  placeHolderSearchText?: string;
  searchAutoFocus?: boolean;
}

function isFilterListFavorites(child: React.ReactNode) {
  if (!isValidElement(child)) {
    return false;
  }
  return (
    (child.type as React.ComponentType).displayName === FilterListFavoritesDisplayName
  );
}

export function FilterList({
  children,
  placeHolderSearchText,
  searchAutoFocus
}: FilterListProps) {
  const [searchString, setSearchString] = useState('');
  const [showDataInstead, setShowdataInstead] = useState(false);
  const isSearching = searchString !== '';

  function toggleShowDataInstead() {
    setShowdataInstead((current) => !current);
  }

  // See if favorities is among children
  const hasFavorites = Boolean(
    Children.toArray(children).find((child) => isFilterListFavorites(child))
  );

  const showFavorites = !isSearching && hasFavorites && !showDataInstead;
  const buttons: React.ReactElement[] = [];
  const filteredChildren = Children.map(children, (child) => {
    // Makes TS happy by removing numbers, strings etc
    if (!isValidElement(child)) {
      return child;
    }
    const childType = child.type as React.ComponentType;
    if (showFavorites && childType.displayName === FilterListFavoritesDisplayName) {
      return child;
    }
    if (!showFavorites && childType.displayName === FilterListDataDisplayName) {
      return cloneElement(child, { searchString: searchString } as FilterListDataProps); // TODO props here
    }
    if (childType.displayName === FilterListShowMoreButtonDisplayName) {
      if (hasFavorites && !isSearching) {
        buttons.push(cloneElement(child, {})); // TODO props here
      }
    }

    return child;
  });

  return (
    <>
      <TextInput
        value={searchString}
        placeholder={placeHolderSearchText}
        onChange={(event) => setSearchString(event.currentTarget.value)}
        rightSection={buttons}
        autoFocus={searchAutoFocus}
      />
      <div>Has havorites: {hasFavorites ? 'True' : 'False'}</div>
      {filteredChildren}
    </>
  );
}
