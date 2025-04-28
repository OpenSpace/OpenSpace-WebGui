import { alpha, Box, Flex, Group, Text } from '@mantine/core';

import { FrictionControls } from '@/components/FrictionControls/FrictionControls';
import { FrictionControlsInfo } from '@/components/FrictionControls/FrictionControlsInfo';
import { InfoBox } from '@/components/InfoBox/InfoBox';
import { ScrollBox } from '@/components/ScrollBox/ScrollBox';
import { useAppSelector } from '@/redux/hooks';

import { FileMenu } from './Menus/FileMenu';
import { HelpMenu } from './Menus/HelpMenu';
import { ViewMenu } from './Menus/ViewMenu';
import { WindowsMenu } from './Menus/WindowsMenu';

export function TopMenuBar() {
  const name = useAppSelector((state) => state.profile.name);

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
        <Group flex={1} wrap={'nowrap'}>
          <FileMenu />
          <WindowsMenu />
          <ViewMenu />
          <HelpMenu />
        </Group>
        <Box flex={1} style={{ overflow: 'hidden' }}>
          <Text ta={'center'}>Profile: {name}</Text>
        </Box>
        <Group flex={1} wrap={'nowrap'} align={'center'} justify={'end'} mr={'xs'}>
          <FrictionControls size={'xs'} />
          <InfoBox>
            <FrictionControlsInfo />
          </InfoBox>
        </Group>
      </Flex>
    </ScrollBox>
  );
}
