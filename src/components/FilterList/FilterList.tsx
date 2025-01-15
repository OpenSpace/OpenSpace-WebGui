import { ActionIcon, Button, Divider, ScrollArea, Stack, TextInput } from '@mantine/core';

import { CancelIcon } from '@/icons/icons';

import { FilterListData } from './FilterListData';
import { FilterListFavorites } from './FilterListFavorites';
import { FilterListProvider } from './FilterListProvider';
import { useFilterListProvider } from './hooks';

interface InputButtonProps {
  showMoreButton: boolean;
}

function InputButton({ showMoreButton }: InputButtonProps) {
  const { searchString, setSearchString, showDataInstead, toggleShowDataInstead } =
    useFilterListProvider();

  const isSearching = searchString !== '';

  if (isSearching) {
    return (
      <ActionIcon size={'lg'} onClick={() => setSearchString('')}>
        <CancelIcon />
      </ActionIcon>
    );
  }

  return (
    showMoreButton && (
      <Button onClick={toggleShowDataInstead}>{showDataInstead ? 'Less' : 'More'}</Button>
    )
  );
}

interface InputFieldProps {
  searchAutoFocus?: boolean;
  placeHolderSearchText?: string;
  showMoreButton: boolean;
}

function InputField({
  searchAutoFocus,
  placeHolderSearchText,
  showMoreButton
}: InputFieldProps) {
  const { searchString, setSearchString } = useFilterListProvider();

  return (
    <TextInput
      value={searchString}
      placeholder={placeHolderSearchText}
      onChange={(event) => setSearchString(event.currentTarget.value)}
      autoFocus={searchAutoFocus}
      // Some arbitrary width must be set so that the More button is rendered correctly
      rightSectionWidth={'md'}
      rightSection={<InputButton showMoreButton={showMoreButton} />}
    />
  );
}

interface FilterListProps {
  children: React.ReactNode;
  placeHolderSearchText?: string;
  searchAutoFocus?: boolean;
  showMoreButton?: boolean;
  height?: number | string;
}

export function FilterList({
  placeHolderSearchText,
  searchAutoFocus,
  showMoreButton = false,
  height = '100%',
  children
}: FilterListProps) {
  return (
    <Stack style={{ height: height }}>
      <FilterListProvider>
        <InputField
          placeHolderSearchText={placeHolderSearchText}
          searchAutoFocus={searchAutoFocus}
          showMoreButton={showMoreButton}
        />
        <Divider my={'xs'}></Divider>
        {children}
      </FilterListProvider>
    </Stack>
  );
}

FilterList.Data = FilterListData;
FilterList.Favorites = FilterListFavorites;
