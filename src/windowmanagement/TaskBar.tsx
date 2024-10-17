import { Button, Group } from '@mantine/core';
import { WindowLayoutOptions } from 'src/windowmanagement/WindowLayout/WindowLayout';

import { menuItemsDB } from './data/MenuItems';

interface TaskBarProps {
  addWindow: (component: JSX.Element, options: WindowLayoutOptions) => void;
  visibleMenuItems: string[];
}

export function TaskBar({ addWindow, visibleMenuItems }: TaskBarProps) {
  const checkedMenuItems = menuItemsDB.filter((item) => {
    return visibleMenuItems.includes(item.componentID);
  });

  return (
    <Group
      style={{
        backgroundColor: '#00000080',
        height: 60,
        paddingLeft: 'var(--mantine-spacing-md)'
      }}
    >
      {checkedMenuItems.map((item) => {
        const handleClick = () =>
          addWindow(item.content, {
            title: item.title,
            position: item.preferredPosition
          });

        return item.renderMenuButton ? (
          item.renderMenuButton(item.componentID, handleClick)
        ) : (
          <Button key={item.componentID} size={'xl'} onClick={handleClick}>
            {item.title}
          </Button>
        );
      })}
    </Group>
  );
}
