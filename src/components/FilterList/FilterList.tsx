import { Children, cloneElement, isValidElement, useState } from 'react';
import { Divider, TextInput } from '@mantine/core';

import { FilterListDataDisplayName, FilterListDataProps } from './FilterListData';
import { FilterListFavoritesDisplayName } from './FilterListFavorites';
import {
  FilterListShowMoreButtonDisplayName,
  FilterListShowMoreButtonProps
} from './FilterListShowMoreButton';

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
  const buttons: React.ReactNode[] = [];
  const filteredChildren = Children.map(children, (child) => {
    // We have to narrow down the types of child so we can access child.type.
    // numbers, strings etc are rendered as is.
    if (!isValidElement(child)) {
      return child;
    }
    const childType = child.type as React.ComponentType;
    if (showFavorites && childType.displayName === FilterListFavoritesDisplayName) {
      return child;
    }
    if (!showFavorites && childType.displayName === FilterListDataDisplayName) {
      return cloneElement(child, { searchString: searchString } as FilterListDataProps);
    }
    if (childType.displayName === FilterListShowMoreButtonDisplayName) {
      if (hasFavorites && !isSearching) {
        const props: FilterListShowMoreButtonProps = {
          key: `${FilterListShowMoreButtonDisplayName}-${buttons.length}`,
          showDataInstead: showDataInstead,
          toggleShowDataInstead: toggleShowDataInstead
        };
        buttons.push(cloneElement(child, props));
      }
    }

    return null;
  });

  return (
    <>
      <TextInput
        value={searchString}
        placeholder={placeHolderSearchText}
        onChange={(event) => setSearchString(event.currentTarget.value)}
        autoFocus={searchAutoFocus}
        rightSection={buttons}
        // Some arbitrary width must be set so Mantine Buttons are rendered properly
        rightSectionWidth={'md'}
      />
      <Divider my={'xs'}></Divider>
      {filteredChildren}
    </>
  );
}
