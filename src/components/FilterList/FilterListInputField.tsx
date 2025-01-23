import { ActionIcon, Button, TextInput } from '@mantine/core';

import { CancelIcon } from '@/icons/icons';

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
  showMoreButton?: boolean;
}

export function FilterListInputField({
  searchAutoFocus,
  placeHolderSearchText,
  showMoreButton = false
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
