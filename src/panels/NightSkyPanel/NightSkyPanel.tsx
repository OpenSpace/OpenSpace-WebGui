import { useTranslation } from 'react-i18next';
import { Box, Tabs } from '@mantine/core';

import { LocationTab } from './tabs/LocationTab';
import { MarkingsTab } from './tabs/MarkingsTab/MarkingsTab';
import { SolarSystemTab } from './tabs/SolarSystemTab';
import { StarsTab } from './tabs/StarsTab';
import { SunTab } from './tabs/SunTab';
import { TimeTab } from './tabs/TimeTab';

export function NightSkyPanel() {
  const { t } = useTranslation('panel-nightsky', { keyPrefix: 'tab-headers' });

  return (
    <Tabs defaultValue={'markings'}>
      <Tabs.List>
        <Tabs.Tab value={'markings'}>{t('markings')}</Tabs.Tab>
        <Tabs.Tab value={'time'}>{t('time')}</Tabs.Tab>
        <Tabs.Tab value={'location'}>{t('location')}</Tabs.Tab>
        <Tabs.Tab value={'stars'}>{t('stars')}</Tabs.Tab>
        <Tabs.Tab value={'solarsystem'}>{t('solar-system')}</Tabs.Tab>
        <Tabs.Tab value={'sun'}>{t('sun')}</Tabs.Tab>
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
