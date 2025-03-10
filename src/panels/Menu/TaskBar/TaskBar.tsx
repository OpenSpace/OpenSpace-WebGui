import { alpha, Box, Flex } from '@mantine/core';

import { menuItemsData } from '@/windowmanagement/data/MenuItems';

import { useMenuItems } from '../hooks';

import { TaskBarMenuButton } from './TaskBarMenuButton';

export function TaskBar() {
  const { filteredMenuItems } = useMenuItems();

  return (
    <Flex
      style={{
        whiteSpace: 'nowrap',
        overflowX: 'auto',
        overflowY: 'hidden'
      }}
      onWheel={(event) => {
        event.currentTarget.scrollLeft += event.deltaY;
      }}
    >
      {filteredMenuItems.map((itemConfig, i) => {
        const isLastItem = i === filteredMenuItems.length - 1;
        const item = menuItemsData[itemConfig.id];
        return (
          // The wrapper box is needed here so custom menu buttons like the play/pause,
          // are playing nicely with the rest of the buttons. For example the
          // SessionRecording Play/Pause buttons wrap on multiple rows without this css
          <Box
            key={item.componentID}
            flex={'0 0 auto'}
            bg={alpha('dark.7', 0.7)}
            style={{
              borderTopRightRadius: isLastItem ? 'var(--mantine-radius-md)' : undefined
            }}
          >
            <TaskBarMenuButton item={item} disabled={!itemConfig.enabled} />
          </Box>
        );
      })}
    </Flex>
  );
}
