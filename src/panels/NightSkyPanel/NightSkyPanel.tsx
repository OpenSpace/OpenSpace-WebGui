import { Container, Divider, Group, Space, Tabs } from '@mantine/core';
import { useElementSize } from '@mantine/hooks';

import { NightSkyLocationTab } from './tabs/NightSkyLocationTab';
import { NightSkyMarkingsTab } from './tabs/NightSkyMarkingsTab';
import { NightSkySolarSystemTab } from './tabs/NightSkySolarSystemTab';
import { NightSkyStarsTab } from './tabs/NightSkyStarsTab';
import { NightSkySunTab } from './tabs/NightSkySunTab';
import { NightSkyTimeTab } from './tabs/NightSkyTimeTab';

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
      <Group p={'md'}>
        <Tabs.Panel value={'markings'}>
          <NightSkyMarkingsTab />
        </Tabs.Panel>
        <Tabs.Panel value={'location'}>
          <NightSkyLocationTab />
        </Tabs.Panel>
        <Tabs.Panel value={'stars'}>
          <NightSkyStarsTab />
        </Tabs.Panel>
        <Tabs.Panel value={'time'}>
          <NightSkyTimeTab />
        </Tabs.Panel>
        <Tabs.Panel value={'solarsystem'}>
          <NightSkySolarSystemTab />
        </Tabs.Panel>
        <Tabs.Panel value={'sun'}>
          <NightSkySunTab />
        </Tabs.Panel>
      </Group>
    </Tabs>
  );
}
