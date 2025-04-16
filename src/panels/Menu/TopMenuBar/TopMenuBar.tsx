import { alpha, Box, Flex, Group, Text } from '@mantine/core';

import { FrictionControls } from '@/components/FrictionControls/FrictionControls';
import { ScrollBox } from '@/components/ScrollBox/ScrollBox';

import { FileMenu } from './Menus/FileMenu';
import { HelpMenu } from './Menus/HelpMenu';
import { ViewMenu } from './Menus/ViewMenu';
import { WindowsMenu } from './Menus/WindowsMenu';
import { useAppSelector } from '@/redux/hooks';

export function TopMenuBar() {
  const name = useAppSelector((state) => state.profile.name);
  // If each child has this flex, they are ensured to have the same size
  const flex = '1 1 0px';

  return (
    <ScrollBox direction={'horizontal'}>
      <Flex
        gap={'xs'}
        h={30}
        bg={alpha('var(--mantine-color-dark-9)', 0.9)}
        justify={'space-between'}
        align={'center'}
        style={{
          whiteSpace: 'nowrap'
        }}
      >
        <Group flex={flex}>
          <FileMenu />
          <WindowsMenu />
          <ViewMenu />
          <HelpMenu />
        </Group>
        <Box flex={flex}>
          <Text ta={'center'}>Profile: {name}</Text>
        </Box>
        <Box flex={flex}>
          <FrictionControls size={'xs'} gap={2} mr={'xs'} justify="end" />
        </Box>
      </Flex>
    </ScrollBox>
  );
}
