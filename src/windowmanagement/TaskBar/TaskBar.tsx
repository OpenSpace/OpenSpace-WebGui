import { Box, Flex } from '@mantine/core';
import { WindowLayoutOptions } from 'src/windowmanagement/WindowLayout/WindowLayout';

import { menuItemsDB } from '@/windowmanagement/data/MenuItems';

import { TaskBarMenuButton } from './TaskBarMenuButton';

interface Props {
  addWindow: (component: React.JSX.Element, options: WindowLayoutOptions) => void;
  visibleMenuItems: string[];
}

export function TaskBar({ addWindow, visibleMenuItems }: Props) {
  const checkedMenuItems = menuItemsDB.filter((item) => {
    return visibleMenuItems.includes(item.componentID);
  });

  return (
    <Flex
      gap={2}
      style={{
        backgroundColor: '#00000080',
        whiteSpace: 'nowrap',
        overflowX: 'auto',
        overflowY: 'hidden'
      }}
      onWheel={(event) => {
        event.currentTarget.scrollLeft += event.deltaY;
      }}
    >
      {checkedMenuItems.map((item) => {
        return (
          <Box key={item.componentID} style={{ flex: '0 0 auto' }}>
            <TaskBarMenuButton addWindow={addWindow} item={item} />
          </Box>
        );
      })}
    </Flex>
  );
}
