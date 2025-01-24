import React from 'react';
import { ActionIcon, Button, Flex } from '@mantine/core';
import { WindowLayoutOptions } from 'src/windowmanagement/WindowLayout/WindowLayout';

import { IconSize } from '@/types/enums';

import { menuItemsDB } from './data/MenuItems';

interface TaskBarProps {
  addWindow: (component: React.JSX.Element, options: WindowLayoutOptions) => void;
  visibleMenuItems: string[];
}

export function TaskBar({ addWindow, visibleMenuItems }: TaskBarProps) {
  const checkedMenuItems = menuItemsDB.filter((item) => {
    return visibleMenuItems.includes(item.componentID);
  });

  return (
    <Flex
      gap={2}
      style={{
        backgroundColor: '#00000080',
        whiteSpace: 'nowrap',
        overflowX: 'auto'
      }}
    >
      {checkedMenuItems.map((item) => {
        function handleClick() {
          addWindow(item.content, {
            title: item.title,
            position: item.preferredPosition,
            id: item.componentID
          });
        }

        return (
          <div style={{ flex: '0 0 auto' }}>
            {item.renderMenuButton ? (
              item.renderMenuButton(item.componentID, handleClick)
            ) : (
              <>
                {item.icon ? (
                  <ActionIcon
                    key={item.componentID}
                    onClick={handleClick}
                    size={'input-xl'}
                  >
                    {item.icon?.(IconSize.lg)}
                  </ActionIcon>
                ) : (
                  <Button key={item.componentID} onClick={handleClick} size={'xl'}>
                    {item.title}
                  </Button>
                )}
              </>
            )}
          </div>
        );
      })}
    </Flex>
  );
}
