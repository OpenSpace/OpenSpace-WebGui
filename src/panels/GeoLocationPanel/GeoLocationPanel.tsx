import { useTranslation } from 'react-i18next';
import { Tabs, Title } from '@mantine/core';

import { EarthPanel } from './AnchorPanels/EarthPanel/EarthPanel';
import { AddedCustomNodes } from './AddedCustomNodes';
import { CustomCoordinates } from './CustomCoordinates';
import { MapLocation } from './MapLocation';

const SearchPlaceKey = 'Search Place';
const CustomCoordinatesKey = 'Custom Coordinates';
const MapsKey = 'Map';

export function GeoLocationPanel() {
  const { t } = useTranslation('panel-geolocation');

  return (
    <>
      <Tabs defaultValue={SearchPlaceKey}>
        <Tabs.List>
          <Tabs.Tab value={SearchPlaceKey}>{t('tab-labels.search')}</Tabs.Tab>
          <Tabs.Tab value={CustomCoordinatesKey}>
            {t('tab-labels.custom-coordinates')}
          </Tabs.Tab>
          <Tabs.Tab value={MapsKey}>{t('tab-labels.map-location')}</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value={SearchPlaceKey}>
          <EarthPanel />
        </Tabs.Panel>
        <Tabs.Panel value={CustomCoordinatesKey}>
          <CustomCoordinates />
        </Tabs.Panel>
        <Tabs.Panel value={MapsKey}>
          <MapLocation />
        </Tabs.Panel>
      </Tabs>
      <Title order={2} my={'xs'}>
        {t('added-nodes-title')}
      </Title>
      <AddedCustomNodes />
    </>
  );
}
