import { useTranslation } from 'react-i18next';
import { Menu } from '@mantine/core';

import { DummyIcon } from '@/icons/icons';

import { useMenuItemsByGroup } from '../../hooks';
import { MenuDropdownWrapper } from '../MenuDropdownWrapper';
import { TopBarMenuWrapper } from '../TopBarMenuWrapper';

import { WindowMenuEntries } from './WindowMenuEntries';

export function WindowsMenu() {
  const { t } = useTranslation('menu', { keyPrefix: 'windows-menu' });
  const { groups, menuItemsByGroup } = useMenuItemsByGroup();

  return (
    <TopBarMenuWrapper closeOnItemClick targetTitle={t('title')}>
      {groups.map((group) => {
        const items = menuItemsByGroup[group];
        // Don't render the ungrouped in a sub menu
        if (group === 'Ungrouped') {
          return <WindowMenuEntries items={items} key={group} />;
        }
        return (
          <Menu.Sub position={'right-start'} withinPortal={false} key={group}>
            <Menu.Sub.Target>
              <Menu.Sub.Item
                leftSection={<DummyIcon color={'transparent'} />}
                style={{ borderLeft: 'var(--openspace-border-active-placeholder)' }}
              >
                {group}
              </Menu.Sub.Item>
            </Menu.Sub.Target>

            <MenuDropdownWrapper isSubMenu shouldLimitHeight>
              <WindowMenuEntries items={items} />
            </MenuDropdownWrapper>
          </Menu.Sub>
        );
      })}
    </TopBarMenuWrapper>
  );
}
