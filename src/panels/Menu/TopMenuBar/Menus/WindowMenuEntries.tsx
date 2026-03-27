import { Box, CloseButton, Group, Menu } from '@mantine/core';

import { IconSize } from '@/types/enums';
import { useWindowLayoutProvider } from '@/windowmanagement/WindowLayout/hooks';

import { MenuItemWithConfig } from '../../types';

interface Props {
  items: MenuItemWithConfig[];
}

export function WindowMenuEntries({ items }: Props) {
  const { addWindow, closeWindow } = useWindowLayoutProvider();

  return (
    <>
      {items.map((item) => (
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
              borderLeft: item.isOpen
                ? 'var(--openspace-border-active)'
                : 'var(--openspace-border-active-placeholder)',
              borderRadius: 0
            }}
            flex={1}
          >
            {item.title}
          </Menu.Item>
          <Box w={IconSize.md}>
            {item.isOpen && (
              <CloseButton
                onClick={() => closeWindow(item.componentID)}
                size={IconSize.md}
              />
            )}
          </Box>
        </Group>
      ))}
    </>
  );
}
