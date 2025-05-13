import { Tabs } from '@mantine/core';
import { useElementSize } from '@mantine/hooks';

import { useWindowSize } from '@/windowmanagement/Window/hooks';

import { KeyboardLayout } from './KeyboardLayout';
import { ListLayout } from './ListLayout';

export function KeybindsPanel() {
  const { height: windowHeight } = useWindowSize();
  const { ref, height: tabsHeight } = useElementSize();

  return (
    <Tabs radius={'md'} defaultValue={'keyboardLayout'}>
      <Tabs.List ref={ref}>
        <Tabs.Tab value={'keyboardLayout'}>Keyboard View</Tabs.Tab>
        <Tabs.Tab value={'listLayout'}>List View</Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value={'keyboardLayout'}>
        <KeyboardLayout />
      </Tabs.Panel>
      <Tabs.Panel value={'listLayout'}>
        <ListLayout height={windowHeight - tabsHeight} />
      </Tabs.Panel>
    </Tabs>
  );
}
