import { Container, Tabs } from '@mantine/core';

import { KeyboardLayout } from './KeyboardLayout';
import { ListLayout } from './ListLayout';

export function KeybindsPanel() {
  return (
    <Container maw={'none'} mt={'xs'} h={'100%'} w={'100%'}>
      <Tabs variant={'outline'} radius={'md'} defaultValue={'keyboardLayout'}>
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
    </Container>
  );
}
