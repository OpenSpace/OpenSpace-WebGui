import { Box, Tabs } from '@mantine/core';

import { KeyboardLayout } from './KeyboardLayout';
import { ListLayout } from './ListLayout';

export function KeybindsPanel() {
  return (
    <Box>
      <Tabs radius={'md'} defaultValue={'keyboardLayout'}>
        <Tabs.List>
          <Tabs.Tab value={'keyboardLayout'}>Keyboard View</Tabs.Tab>
          <Tabs.Tab value={'listLayout'}>List View</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value={'keyboardLayout'}>
          <KeyboardLayout />
        </Tabs.Panel>
        <Tabs.Panel value={'listLayout'}>
          <ListLayout />
        </Tabs.Panel>
      </Tabs>
    </Box>
  );
}
