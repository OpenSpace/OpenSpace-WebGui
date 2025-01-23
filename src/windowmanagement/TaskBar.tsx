import React from 'react';
import { Button, Group } from '@mantine/core';
import { WindowLayoutOptions } from 'src/windowmanagement/WindowLayout/WindowLayout';

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
    <div
      style={{
        backgroundColor: '#00000080',
        height: 60,
        overflowX: 'scroll',
        display: 'flex',
        flexWrap: 'wrap',
        flexDirection: 'column'
      }}
    >
      {checkedMenuItems.map((item) => {
        const handleClick = () =>
          addWindow(item.content, {
            title: item.title,
            position: item.preferredPosition,
            id: item.componentID
          });

        return item.renderMenuButton ? (
          <div style={{ margin: '0 2px' }}>
            {item.renderMenuButton(item.componentID, handleClick)}
          </div>
        ) : (
          <Button key={item.componentID} size={'xl'} onClick={handleClick} mx={2}>
            {item.title}
          </Button>
        );
      })}
    </div>
  );
}
