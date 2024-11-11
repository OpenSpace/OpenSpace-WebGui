import { Divider, TextInput } from '@mantine/core';

import { FilterListData } from './FilterListData';
import { FilterListFavorites } from './FilterListFavorites';
import { useFilterListProvider, FilterListProvider } from './FilterListProvider';
import { Button } from '@mantine/core';

interface InputFieldProps {
  searchAutoFocus?: boolean;
  placeHolderSearchText?: string;
  showMoreButton: boolean;
  toggleShowDataInstead?: () => void;
}

function InputField({
  searchAutoFocus,
  placeHolderSearchText,
  toggleShowDataInstead,
  showMoreButton
}: InputFieldProps) {
  const { searchString, setSearchString, showDataInstead } = useFilterListProvider();

  return (
    <TextInput
      value={searchString}
      placeholder={placeHolderSearchText}
      onChange={(event) => setSearchString(event.currentTarget.value)}
      autoFocus={searchAutoFocus}
      rightSection={
        showMoreButton && (
          <Button onClick={toggleShowDataInstead}>
            {showDataInstead ? 'Less' : 'More'}
          </Button>
        )
      }
    />
  );
}

interface FilterListProps {
  children: React.ReactNode;
  placeHolderSearchText?: string;
  searchAutoFocus?: boolean;
  showMoreButton?: boolean;
}

export function FilterList({
  placeHolderSearchText,
  searchAutoFocus,
  showMoreButton = false,
  children
}: FilterListProps) {
  return (
    <FilterListProvider>
      <InputField
        placeHolderSearchText={placeHolderSearchText}
        searchAutoFocus={searchAutoFocus}
        showMoreButton={showMoreButton}
      />
      <Divider my={'xs'}></Divider>
      {children}
    </FilterListProvider>
  );
}

export default Object.assign(FilterList, {
  Data: FilterListData,
  Favorites: FilterListFavorites
});
