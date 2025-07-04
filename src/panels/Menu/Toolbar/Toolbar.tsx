import { alpha, Box, Flex } from '@mantine/core';

import { ScrollBox } from '@/components/ScrollBox/ScrollBox';
import { IconSize } from '@/types/enums';
import { menuItemsData } from '@/windowmanagement/data/MenuItems';

import { useMenuItems } from '../hooks';

import { ToolbarMenuButton } from './ToolbarMenuButton';

export function Toolbar() {
  const { filteredMenuItems } = useMenuItems();

  return (
    <ScrollBox direction={'horizontal'}>
      <Flex
        style={{
          whiteSpace: 'nowrap'
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
                item.renderMenuButton(item.componentID)
              ) : (
                <ToolbarMenuButton id={item.componentID}>
                  {item.renderIcon ? item.renderIcon(IconSize.lg) : item.title}
                </ToolbarMenuButton>
              )}
            </Box>
          );
        })}
      </Flex>
    </ScrollBox>
  );
}
