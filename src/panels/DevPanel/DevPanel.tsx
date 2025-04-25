import { Tabs } from '@mantine/core';

import { PropertyTest } from './Subpanels/PropertyTest';

export function DevPanel() {
  return (
    <Tabs allowTabDeactivation>
      <Tabs.List>
        <Tabs.Tab value={'propertyTest'}>Property Test</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value={'propertyTest'}>
        <PropertyTest />
      </Tabs.Panel>
    </Tabs>
  );
}
