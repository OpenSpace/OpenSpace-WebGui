import { useTranslation } from 'react-i18next';
import { Tabs, Title } from '@mantine/core';
import { AnchorPanel } from './AnchorPanel';
import { CustomCoordinates } from './CustomCoordinates';
import { AddedCustomNodes } from './AddedCustomNodes';

const SearchPlaceKey = 'Search Place';
const CustomCoordinatesKey = 'Custom Coordinates';
const MapsKey = 'Map';

export function GeoLocationPanel() {
  const { t } = useTranslation('panel-geolocation', { keyPrefix: 'earth-panel' });

  return (
    <>
      <Tabs variant={'outline'} defaultValue={SearchPlaceKey} radius={'md'}>
        <Tabs.List>
          <Tabs.Tab value={SearchPlaceKey}>{t('tab-search')}</Tabs.Tab>
          <Tabs.Tab value={CustomCoordinatesKey}>{t('tab-custom-coordinates')}</Tabs.Tab>
          <Tabs.Tab value={MapsKey}>Map</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value={SearchPlaceKey}>
          <AnchorPanel />
        </Tabs.Panel>
        <Tabs.Panel value={CustomCoordinatesKey}>
          <CustomCoordinates />
        </Tabs.Panel>
        <Tabs.Panel value={MapsKey}>
          <div> hej</div>
        </Tabs.Panel>
      </Tabs>
      <Title order={2} my={'xs'}>
        {t('added-nodes-title')}
      </Title>
      <AddedCustomNodes />
    </>
  );
}
