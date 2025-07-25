import { useTranslation } from 'react-i18next';
import { ActionIcon, Menu } from '@mantine/core';

import { LanguageIcon } from '@/icons/icons';
import { SupportedLanguages } from '@/localization/config';
import { IconSize } from '@/types/enums';

import { TopBarMenuWrapper } from '../TopBarMenuWrapper';

export function LocaleSwitcher() {
  const { i18n } = useTranslation();

  function languageIcon(): React.JSX.Element {
    const { language } = i18n;
    return language ? (
      SupportedLanguages[language].icon
    ) : (
      <LanguageIcon size={IconSize.sm} />
    );
  }

  function changeLanguage(language: string): void {
    i18n.changeLanguage(language);
  }

  return (
    <TopBarMenuWrapper
      targetTitle={
        <ActionIcon size={'input-xs'} variant={'menubar'} aria-label={'Select language'}>
          {languageIcon()}
        </ActionIcon>
      }
    >
      {Object.entries(SupportedLanguages).map(([code, info]) => (
        <Menu.Item
          key={code}
          leftSection={info.icon}
          onClick={() => changeLanguage(code)}
          aria-label={info.language}
        >
          {info.language}
        </Menu.Item>
      ))}
    </TopBarMenuWrapper>
  );
}
