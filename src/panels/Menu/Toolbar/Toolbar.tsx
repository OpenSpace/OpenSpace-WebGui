import { alpha, Box, Flex } from '@mantine/core';

import { ScrollBox } from '@/components/ScrollBox/ScrollBox';
import { IconSize } from '@/types/enums';

import { useMenuItems } from '../hooks';

import { ToolbarMenuButton } from './ToolbarMenuButton';

export function Toolbar() {
  const menuItems = useMenuItems();
  const visibleMenuItems = menuItems.filter((item) => item.visible);

  return (
    <ScrollBox direction={'horizontal'}>
      <Flex
        style={{
          whiteSpace: 'nowrap'
        }}
      >
        {visibleMenuItems.map((item, i) => {
          const isLastItem = i === menuItems.length - 1;
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
