import { useTranslation } from 'react-i18next';
import { Box, Button, TextInput, Title } from '@mantine/core';

import { AddedCustomNodes } from './AddedCustomNodes';
import { MapLocation } from './MapLocation';
import { CustomCoordinates } from './CustomCoordinates';
import { useEffect, useState } from 'react';
import { useAnchorNode } from '@/util/propertyTreeHooks';
import { useDisclosure, useElementSize } from '@mantine/hooks';
import { useWindowSize } from '@/windowmanagement/Window/hooks';
import { SearchOverlay } from './AnchorPanels/EarthPanel/SearchOverlay';
import { Coordinates, MouseMarker } from './types';

export function GeoLocationPanel() {
  const { t } = useTranslation('panel-geolocation');

  const [coordinates, setCoordinates] = useState<Coordinates>({
    lat: 0,
    long: 0,
    alt: 0
  });
  const [customName, setCustomName] = useState('');
  const [mouseMarker, setMouseMarker] = useState<MouseMarker>(undefined);
  // Search string is the input value, search is the actual search term
  // that is used to fetch results. This is to not trigger a search
  // on every keystroke, but only when the user presses enter or clicks the search.
  const [searchString, setSearchString] = useState('');
  const [search, setSearch] = useState('');

  const [visible, { open, close, toggle }] = useDisclosure(false);

  const { height: windowHeight } = useWindowSize();
  const { ref: topRef, height: topHeight } = useElementSize();

  const anchor = useAnchorNode();

  const isOnEarth = anchor?.name === 'Earth';

  useEffect(() => {
    // Reset mouse marker when anchor changes
    setMouseMarker(undefined);
    setSearch('');
    setSearchString('');
    setCustomName('');
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
          value={searchString}
          onChange={(e) => setSearchString(e.currentTarget.value)}
          disabled={!isOnEarth}
          my={'md'}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              setSearch(event.currentTarget.value);
              openIfNotOpen();
            }
          }}
          placeholder={
            isOnEarth
              ? 'Search locations on Earth'
              : `No search available for ${anchor?.name}`
          }
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
          setCoordinates={setCoordinates}
          coordinates={coordinates}
        />
        <Title mt={'md'} mb={'sm'}>
          Added nodes
        </Title>
        <AddedCustomNodes />
      </Box>
    </>
  );
}
