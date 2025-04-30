import { useTranslation } from 'react-i18next';
import { ActionIcon, Menu } from '@mantine/core';

import { LanguageIcon } from '@/icons/icons';
import { SupportedLanguages } from '@/localization/config';
import { IconSize } from '@/types/enums';

import { TopBarMenuWrapper } from '../TopBarMenuWrapper';

export function LocaleSwitcher() {
  const { i18n } = useTranslation('settings');

  function languageIcon(): React.JSX.Element {
    const { resolvedLanguage } = i18n;
    return resolvedLanguage ? (
      SupportedLanguages[resolvedLanguage].icon
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
      <Menu.Label>Language</Menu.Label>
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
