import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Button, TextInput, Title } from '@mantine/core';
import { useDisclosure, useElementSize } from '@mantine/hooks';

import { useAnchorNode } from '@/util/propertyTreeHooks';
import { useWindowSize } from '@/windowmanagement/Window/hooks';

import { SearchOverlay } from './Search/SearchOverlay';
import { hasGeoLocationData } from './Search/util';
import { AddedCustomNodes } from './AddedCustomNodes';
import { CustomCoordinates } from './CustomCoordinates';
import { MapLocation } from './MapLocation';
import { GeoCoordinates, MouseMarkerPosition } from './types';

export function GeoLocationPanel() {
  const { t } = useTranslation('panel-geolocation');

  const [coordinates, setCoordinates] = useState<GeoCoordinates>({
    lat: 0,
    long: 0,
    alt: 0
  });
  const [customName, setCustomName] = useState('');
  const [mouseMarker, setMouseMarker] = useState<MouseMarkerPosition>(undefined);
  // Search string is the input value, search is the actual search term
  // that is used to fetch results. This is to not trigger a search
  // on every keystroke, but only when the user presses enter or clicks the search.
  const [searchString, setSearchString] = useState('');
  const [search, setSearch] = useState('');
  const [searchExists, setSearchExists] = useState(false);
  const [visible, { open, close, toggle }] = useDisclosure(false);

  const { height: windowHeight } = useWindowSize();
  const { ref: topRef, height: topHeight } = useElementSize();

  const anchor = useAnchorNode();

  useEffect(() => {
    // If the anchor changes, check if it has geolocation data
    if (anchor) {
      hasGeoLocationData(anchor.name).then((hasData) => setSearchExists(hasData));
    }

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
          onClick={(lat, long) =>
            setCoordinates((old: GeoCoordinates) => ({
              lat,
              long,
              alt: old.alt
            }))
          }
          mouseMarker={mouseMarker}
          setMouseMarker={setMouseMarker}
        />
        <TextInput
          value={searchString}
          onChange={(e) => setSearchString(e.currentTarget.value)}
          disabled={!searchExists}
          my={'md'}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              setSearch(event.currentTarget.value);
              openIfNotOpen();
            }
          }}
          placeholder={
            searchExists
              ? t('custom-coordinates.search-placeholder', { anchor: anchor?.name })
              : t('custom-coordinates.search-placeholder-disabled', {
                  anchor: anchor?.name
                })
          }
          onClick={() => search !== '' && toggle()}
          rightSection={
            <Button disabled={!searchExists} onClick={openIfNotOpen}>
              {t('earth-panel.search.button-label')}
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
          {t('added-nodes-title')}
        </Title>
        <AddedCustomNodes />
      </Box>
    </>
  );
}
