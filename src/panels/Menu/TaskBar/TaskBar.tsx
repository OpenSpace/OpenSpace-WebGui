import { alpha, Box, Flex } from '@mantine/core';

import { menuItemsData } from '@/windowmanagement/data/MenuItems';

import { TaskBarMenuButton } from './TaskBarMenuButton';

interface Props {
  visibleMenuItems: string[];
}

export function TaskBar({ visibleMenuItems }: Props) {
  const visibleTaskBarButtons = menuItemsData.filter((item) => {
    return visibleMenuItems.includes(item.componentID);
  });

  return (
    <Flex
      style={{
        whiteSpace: 'nowrap',
        overflowX: 'auto',
        overflowY: 'hidden',
        borderTopRightRadius: 'var(--mantine-radius-md)'
      }}
      w={'fit-content'}
      bg={alpha('dark.7', 0.7)}
      onWheel={(event) => {
        event.currentTarget.scrollLeft += event.deltaY;
      }}
    >
      {visibleTaskBarButtons.map((item) => {
        return (
          // The wrapper box is needed here so custom menu buttons like the play/pause,
          // are playing nicely with the rest of the buttons. For example the
          // SessionRecording Play/Pause buttons wrap on multiple rows without this css
          <Box key={item.componentID} flex={'0 0 auto'}>
            <TaskBarMenuButton item={item} />
          </Box>
        );
      })}
    </Flex>
  );
}
