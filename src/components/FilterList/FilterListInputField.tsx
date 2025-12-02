import { useTranslation } from 'react-i18next';
import { Button, MantineStyleProps, TextInput } from '@mantine/core';

import { ClearButton } from '../ClearButton/ClearButton';

import { useFilterListProvider } from './hooks';

interface InputButtonProps {
  showMoreButton: boolean;
}

function InputButton({ showMoreButton }: InputButtonProps) {
  const { t } = useTranslation('components', { keyPrefix: 'filter-list.input-field' });

  const { searchString, setSearchString, showDataInstead, toggleShowDataInstead } =
    useFilterListProvider();

  const isSearching = searchString !== '';

  if (isSearching) {
    return (
      <ClearButton
        onClick={() => setSearchString('')}
        ariaLabel={t('cancel-button-aria-label')}
      />
    );
  }

  return (
    showMoreButton && (
      <Button w={80} variant={'subtle'} color={'gray'} onClick={toggleShowDataInstead}>
        {showDataInstead ? t('show-more-button.less') : t('show-more-button.more')}
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
