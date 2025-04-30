import { Box, Tabs } from '@mantine/core';

import { PropertyTest } from './Subpanels/PropertyTest';

export function DevPanel() {
  return (
    <Tabs defaultValue={'propertyTest'}>
      <Tabs.List>
        <Tabs.Tab value={'propertyTest'}>Property Test</Tabs.Tab>
      </Tabs.List>

      <Box pt={'md'}>
        <Tabs.Panel value={'propertyTest'}>
          <PropertyTest />
        </Tabs.Panel>
      </Box>
    </Tabs>
  );
}
