import { Box, FileInput, Tabs } from '@mantine/core';

import { PropertyTest } from './Subpanels/PropertyTest';
import { useSubscribeToDownloadEvent } from '@/hooks/topicSubscriptions';

export function DevPanel() {
  useSubscribeToDownloadEvent();

  console.log('Rerender devpanel');

  return (
    <Tabs defaultValue={'propertyTest'}>
      <Tabs.List>
        <Tabs.Tab value={'propertyTest'}>Property Test</Tabs.Tab>
      </Tabs.List>

      <Box pt={'md'}>
        <Tabs.Panel value={'propertyTest'}>
          <PropertyTest />
        </Tabs.Panel>

        <FileInput label="Select files"></FileInput>
      </Box>
    </Tabs>
  );
}
