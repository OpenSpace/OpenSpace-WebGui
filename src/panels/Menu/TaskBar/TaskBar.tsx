import { alpha, Box, Flex } from '@mantine/core';

import { IconSize } from '@/types/enums';
import { MenuItem, menuItemsData } from '@/windowmanagement/data/MenuItems';
import { useWindowLayoutProvider } from '@/windowmanagement/WindowLayout/hooks';

import { useMenuItems } from '../hooks';

import { TaskBarMenuButton } from './TaskBarMenuButton';

export function TaskBar() {
  const { filteredMenuItems } = useMenuItems();
  const { addWindow, closeWindow } = useWindowLayoutProvider();

  function eventHandlers(item: MenuItem) {
    function onClick(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
      if (event.shiftKey) {
        closeWindow(item.componentID);
      } else {
        addWindow(item.content, {
          title: item.title,
          position: item.preferredPosition,
          id: item.componentID,
          floatPosition: item.floatPosition
        });
      }
    }

    function onRightClick(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
      event.preventDefault();
      closeWindow(item.componentID);
    }

    return {
      onClick,
      onRightClick
    };
  }

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
            {item?.renderMenuButton ? (
              item.renderMenuButton(eventHandlers(item))
            ) : (
              <TaskBarMenuButton {...eventHandlers(item)} aria-label={item.title}>
                {item.renderIcon ? item.renderIcon(IconSize.lg) : item.title}
              </TaskBarMenuButton>
            )}
          </Box>
        );
      })}
    </Flex>
  );
}
