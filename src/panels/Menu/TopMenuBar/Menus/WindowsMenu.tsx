import { useTranslation } from 'react-i18next';
import { Box, CloseButton, Group, Menu } from '@mantine/core';

import { IconSize } from '@/types/enums';
import { menuItemsData } from '@/windowmanagement/data/MenuItems';
import { useWindowLayoutProvider } from '@/windowmanagement/WindowLayout/hooks';

import { useMenuItems } from '../../hooks';
import { TopBarMenuWrapper } from '../TopBarMenuWrapper';

export function WindowsMenu() {
  const { addWindow, closeWindow } = useWindowLayoutProvider();
  const { menuItems } = useMenuItems();
  const { t } = useTranslation('menu', { keyPrefix: 'windows-menu' });

  return (
    <TopBarMenuWrapper closeOnItemClick targetTitle={t('title')}>
      <Menu.Label>{t('add-new-window')}</Menu.Label>
      {menuItems.map((itemConfig) => {
        const item = menuItemsData[itemConfig.id];
        return (
          <Group key={item.componentID} gap={5}>
            <Menu.Item
              leftSection={item.renderIcon?.(IconSize.xs)}
              onClick={() =>
                addWindow(item.content, {
                  title: item.title,
                  position: item.preferredPosition,
                  id: item.componentID,
                  floatPosition: item.floatPosition
                })
              }
              style={{
                borderLeft: itemConfig.isOpen
                  ? 'var(--openspace-border-active)'
                  : 'var(--openspace-border-active-placeholder)',
                borderRadius: 0
              }}
              flex={1}
            >
              {item.title}
            </Menu.Item>
            <Box w={IconSize.md}>
              {itemConfig.isOpen && (
                <CloseButton
                  onClick={() => closeWindow(item.componentID)}
                  size={IconSize.md}
                />
              )}
            </Box>
          </Group>
        );
      })}
    </TopBarMenuWrapper>
  );
}
