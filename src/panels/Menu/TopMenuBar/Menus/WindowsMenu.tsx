import { useTranslation } from 'react-i18next';
import { Menu } from '@mantine/core';

import { useMenuItems } from '../../hooks';
import { TopBarMenuWrapper } from '../TopBarMenuWrapper';
import { MenuItem } from '@/windowmanagement/data/MenuItems';
import { MenuItemGroups } from '@/types/types';
import { MenuItemConfig } from '../../types';
import { MenuDropdownWrapper } from '../MenuDropdownWrapper';
import { WindowMenuEntries } from './WindowMenuEntries';
import { DummyIcon } from '@/icons/icons';

export function WindowsMenu() {
  const { t } = useTranslation('menu', { keyPrefix: 'windows-menu' });
  const menuItems = useMenuItems();

  // Create local type that maps the menu group a list of menu items and corresponding icon
  const WindowsItemGroups = MenuItemGroups.filter((group) => group !== 'HelpMenu');
  type WindowsItemGroup = (typeof WindowsItemGroups)[number];
  type MappedMenuItem = Record<WindowsItemGroup, (MenuItemConfig & MenuItem)[]>;

  // @TODO (anden88 2026-03-04): Decide which of these two we want to go with, the latter
  // we have to specify manually if we add additional groups
  // const menuItemsByGroup: MappedMenuItem = Object.fromEntries(
  //   WindowsItemGroups.map((group) => [group, [] as (MenuItemConfig & MenuItem)[]])
  // ) as MappedMenuItem;

  const menuItemsByGroup: MappedMenuItem = {
    Content: [],
    Ungrouped: [],
    Other: []
  };

  for (const item of menuItems) {
    const group = item.group;
    if (group === 'HelpMenu') {
      continue;
    }
    menuItemsByGroup[group].push(item);
  }

  // Sort respective group alphabetically on title, except for 'Ungrouped'
  for (const group of WindowsItemGroups) {
    if (group !== 'Ungrouped') {
      menuItemsByGroup[group].sort((a, b) => a.title.localeCompare(b.title));
    }
  }

  return (
    <TopBarMenuWrapper closeOnItemClick targetTitle={t('title')}>
      {WindowsItemGroups.map((group) => {
        const items = menuItemsByGroup[group];
        // Don't render the ungrouped in a sub menu
        if (group === 'Ungrouped') {
          return <WindowMenuEntries items={items} key={group} />;
        }
        return (
          <Menu.Sub position={'right-start'} withinPortal={false} key={group}>
            <Menu.Sub.Target>
              <Menu.Sub.Item
                leftSection={<DummyIcon color="transparent" />}
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
