import { useTranslation } from 'react-i18next';
import { ActionIcon, Button, MantineStyleProps, TextInput } from '@mantine/core';

import { CancelIcon } from '@/icons/icons';

import { useFilterListProvider } from './hooks';

interface InputButtonProps {
  showMoreButton: boolean;
}

function InputButton({ showMoreButton }: InputButtonProps) {
  const { searchString, setSearchString, showDataInstead, toggleShowDataInstead } =
    useFilterListProvider();
  const { t } = useTranslation('components', { keyPrefix: 'filter-list' });

  const isSearching = searchString !== '';

  if (isSearching) {
    return (
      <ActionIcon
        size={'lg'}
        variant={'subtle'}
        color={'gray'}
        onClick={() => setSearchString('')}
        aria-label={t('filter-list-input-field.cancel-button-aria-label')}
      >
        <CancelIcon />
      </ActionIcon>
    );
  }

  return (
    showMoreButton && (
      <Button w={80} variant={'subtle'} color={'gray'} onClick={toggleShowDataInstead}>
        {showDataInstead
          ? t('filter-list-input-field.show-more-button.more')
          : t('filter-list-input-field.show-more-button.more')}
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
  ...styleProps // mantine props
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
      {...styleProps}
    />
  );
}
