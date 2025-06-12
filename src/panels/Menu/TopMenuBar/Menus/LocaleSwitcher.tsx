import { useTranslation } from 'react-i18next';
import { ActionIcon, Menu } from '@mantine/core';

import { LanguageIcon } from '@/icons/icons';
import { SupportedLanguages } from '@/localization/config';
import { IconSize } from '@/types/enums';

import { TopBarMenuWrapper } from '../TopBarMenuWrapper';

export function LocaleSwitcher() {
  const { t, i18n } = useTranslation('menu');

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
        <ActionIcon size={'input-xs'} variant={'menubar'}>
          {languageIcon()}
        </ActionIcon>
      }
    >
      <Menu.Label>{t('language.label')}</Menu.Label>
      {Object.entries(SupportedLanguages).map(([code, info]) => (
        <Menu.Item
          key={code}
          leftSection={info.icon}
          onClick={() => changeLanguage(code)}
        >
          {info.language}
        </Menu.Item>
      ))}
    </TopBarMenuWrapper>
  );
}
