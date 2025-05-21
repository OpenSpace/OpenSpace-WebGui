import { Box, Tabs } from '@mantine/core';

import { LocationTab } from './tabs/LocationTab';
import { MarkingsTab } from './tabs/MarkingsTab/MarkingsTab';
import { SolarSystemTab } from './tabs/SolarSystemTab';
import { StarsTab } from './tabs/StarsTab';
import { SunTab } from './tabs/SunTab';
import { TimeTab } from './tabs/TimeTab';

export function NightSkyPanel() {
  return (
    <Tabs defaultValue={'markings'}>
      <Tabs.List>
        <Tabs.Tab value={'markings'}>Markings</Tabs.Tab>
        <Tabs.Tab value={'time'}>Time</Tabs.Tab>
        <Tabs.Tab value={'location'}>Location / View</Tabs.Tab>
        <Tabs.Tab value={'stars'}>Stars</Tabs.Tab>
        <Tabs.Tab value={'solarsystem'}>Solar System</Tabs.Tab>
        <Tabs.Tab value={'sun'}>Sun</Tabs.Tab>
      </Tabs.List>

      <Box p={'xs'}>
        <Tabs.Panel value={'markings'}>
          <MarkingsTab />
        </Tabs.Panel>
        <Tabs.Panel value={'location'}>
          <LocationTab />
        </Tabs.Panel>
        <Tabs.Panel value={'stars'}>
          <StarsTab />
        </Tabs.Panel>
        <Tabs.Panel value={'time'}>
          <TimeTab />
        </Tabs.Panel>
        <Tabs.Panel value={'solarsystem'}>
          <SolarSystemTab />
        </Tabs.Panel>
        <Tabs.Panel value={'sun'}>
          <SunTab />
        </Tabs.Panel>
      </Box>
    </Tabs>
  );
}
