import { alpha, Box, Flex, Group } from '@mantine/core';

import { FrictionControls } from '@/components/FrictionControls/FrictionControls';
import { FrictionControlsInfo } from '@/components/FrictionControls/FrictionControlsInfo';
import { InfoBox } from '@/components/InfoBox/InfoBox';
import { ScrollBox } from '@/components/ScrollBox/ScrollBox';

import { FileMenu } from './Menus/FileMenu';
import { HelpMenu } from './Menus/HelpMenu';
import { ViewMenu } from './Menus/ViewMenu';
import { WindowsMenu } from './Menus/WindowsMenu';
import { IdleBehaviorToggle } from './IdleBehaviorToggle';
// import { LocaleSwitcher } from './Menus/LocaleSwitcher';

export function TopMenuBar() {
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
          {/* <LocaleSwitcher /> */}
        </Group>
        <Box flex={1} style={{ overflow: 'hidden' }}>
          {/* There's space to put something in the center here if we want */}
        </Box>
        <Group flex={1} wrap={'nowrap'} align={'center'} justify={'end'} mr={'xs'}>
          <Group gap={'lg'} wrap={'nowrap'}>
            <IdleBehaviorToggle />
            <Group wrap={'nowrap'} gap={'xs'}>
              <FrictionControls size={'xs'} />
              <InfoBox>
                <FrictionControlsInfo />
              </InfoBox>
            </Group>
          </Group>
        </Group>
      </Flex>
    </ScrollBox>
  );
}
