import { useTranslation } from 'react-i18next';
import { ActionIcon, Menu } from '@mantine/core';

import { LanguageIcon } from '@/icons/icons';
import { SupportedLanguages } from '@/localization/config';
import { MenuWrapper } from '@/panels/Menu/TopMenuBar/MenuWrapper';
import { IconSize } from '@/types/enums';

export function LocaleSwitcher() {
  const { t, i18n } = useTranslation('settings');

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
    <MenuWrapper>
      <Menu.Target>
        <ActionIcon size={'input-xs'} color={'gray'}>
          {languageIcon()}
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Label>{t('language')}</Menu.Label>
        {Object.entries(SupportedLanguages).map(([code, info]) => (
          <Menu.Item
            key={code}
            leftSection={info.icon}
            onClick={() => changeLanguage(code)}
          >
            {info.language}
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </MenuWrapper>
  );
}
