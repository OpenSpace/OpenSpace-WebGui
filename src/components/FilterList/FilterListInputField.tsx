import { ActionIcon, Button, MantineStyleProps, TextInput } from '@mantine/core';

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
      <ActionIcon
        size={'lg'}
        variant={'subtle'}
        color={'gray'}
        onClick={() => setSearchString('')}
      >
        <CancelIcon />
      </ActionIcon>
    );
  }

  return (
    showMoreButton && (
      <Button w={80} variant={'subtle'} color={'gray'} onClick={toggleShowDataInstead}>
        {showDataInstead ? 'Less' : 'More'}
      </Button>
    )
  );
}

interface Props extends MantineStyleProps {
  searchAutoFocus?: boolean;
  placeHolderSearchText?: string;
  showMoreButton?: boolean;
}

export function FilterListInputField({
  searchAutoFocus,
  placeHolderSearchText,
  showMoreButton = false,
  ...other // mantine props
}: Props) {
  const { searchString, setSearchString } = useFilterListProvider();

  function onKeyDown(event: React.KeyboardEvent<HTMLElement>): void {
    if (event.key === 'Escape') {
      setSearchString('');
    }
  }

  return (
    <TextInput
      value={searchString}
      placeholder={placeHolderSearchText}
      onChange={(event) => setSearchString(event.currentTarget.value)}
      autoFocus={searchAutoFocus}
      // Some arbitrary width must be set so that the More button is rendered correctly
      rightSectionWidth={'md'}
      onKeyDown={onKeyDown}
      rightSection={<InputButton showMoreButton={showMoreButton} />}
      {...other}
    />
  );
}
