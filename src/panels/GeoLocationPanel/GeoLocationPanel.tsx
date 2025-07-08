import { useTranslation } from 'react-i18next';
import { Box, Button, Overlay, Text, TextInput, Title, Transition } from '@mantine/core';

import { EarthPanel } from './AnchorPanels/EarthPanel/EarthPanel';
import { AddedCustomNodes } from './AddedCustomNodes';
import { MapLocation, MouseMarker } from './MapLocation';
import { CustomCoordinates } from './CustomCoordinates';
import { useEffect, useState } from 'react';
import { useAnchorNode } from '@/util/propertyTreeHooks';
import { useDisclosure, useElementSize } from '@mantine/hooks';
import { useWindowSize } from '@/windowmanagement/Window/hooks';
import { SearchOverlay } from './SearchOverlay';

export type Coordinates = {
  lat: number;
  long: number;
  alt: number;
};

export function GeoLocationPanel() {
  const { t } = useTranslation('panel-geolocation');

  const [coordinates, setCoordinates] = useState<Coordinates>({
    lat: 0,
    long: 0,
    alt: 0
  });
  const [customName, setCustomName] = useState('');
  const [mouseMarker, setMouseMarker] = useState<MouseMarker>(undefined);
  const anchor = useAnchorNode();
  const [visible, { open, close, toggle }] = useDisclosure(false);

  const [search, setSearch] = useState('');

  const { height: windowHeight } = useWindowSize();

  const { ref: topRef, height: topHeight } = useElementSize();
  const isOnEarth = anchor?.name === 'Earth';

  useEffect(() => {
    // Reset mouse marker when anchor changes
    setMouseMarker(undefined);
    setSearch('');
  }, [anchor]);

  function openIfNotOpen() {
    if (!visible) {
      open();
    }
  }

  return (
    <>
      <Box ref={topRef}>
        <MapLocation
          onClick={(lat, long) => {
            setCoordinates((old) => {
              return {
                lat,
                long,
                alt: old.alt
              };
            });
          }}
          mouseMarker={mouseMarker}
          setMouseMarker={setMouseMarker}
        />

        <TextInput
          disabled={!isOnEarth}
          my={'md'}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              openIfNotOpen();
            }
          }}
          placeholder={
            isOnEarth
              ? 'Search locations on Earth'
              : `No search available for ${anchor?.name}`
          }
          onChange={(event) => {
            setSearch(event.target.value);
            search !== '' ? openIfNotOpen() : close();
          }}
          onClick={() => search !== '' && toggle()}
          rightSection={
            <Button disabled={!isOnEarth} onClick={openIfNotOpen}>
              Search
            </Button>
          }
          rightSectionWidth={'md'}
        />
      </Box>
      <Box pos={'relative'}>
        <SearchOverlay
          h={(windowHeight - topHeight) * 0.7}
          setCustomName={setCustomName}
          setCoordinates={setCoordinates}
          setMouseMarker={setMouseMarker}
          search={search}
          visible={visible}
          close={close}
        />
        <CustomCoordinates
          customName={customName}
          setCustomName={setCustomName}
          coordinates={coordinates}
          setCoordinates={setCoordinates}
        />
        <Title mt={'md'} mb={'sm'}>
          Added nodes
        </Title>
        <AddedCustomNodes />
      </Box>
    </>
  );
}
