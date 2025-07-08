import { useTranslation } from 'react-i18next';
import { Box, Button, Overlay, Text, TextInput, Title, Transition } from '@mantine/core';

import { EarthPanel } from './AnchorPanels/EarthPanel/EarthPanel';
import { AddedCustomNodes } from './AddedCustomNodes';
import { MapLocation, MouseMarker } from './MapLocation';
import { CustomCoordinates } from './CustomCoordinates';
import { useEffect, useState } from 'react';
import { useAnchorNode } from '@/util/propertyTreeHooks';
import { useClickOutside, useDisclosure, useElementSize } from '@mantine/hooks';
import { useWindowSize } from '@/windowmanagement/Window/hooks';

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

  const ref = useClickOutside(() => close());

  const { ref: topRef, height: topHeight } = useElementSize();
  const { height: windowHeight } = useWindowSize();
  const isOnEarth = anchor?.name === 'Earth';

  useEffect(() => {
    // Reset mouse marker when anchor changes
    setMouseMarker(undefined);
    setSearch('');
  }, [anchor]);

  function coordsToMapCoords(latitude: number, longitude: number) {
    setMouseMarker({
      x: (longitude + 180) / 360,
      y: (90 - latitude) / 180
    });
  }

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
      {/* Search overlay */}
      <Box pos={'relative'}>
        {visible && (
          <Overlay backgroundOpacity={0} blur={1}>
            <Transition
              mounted={visible}
              transition="fade"
              duration={400}
              timingFunction="ease"
            >
              {(styles) => (
                <div style={styles}>
                  <Box
                    bd={'1px solid dark.5'}
                    mx={'sm'}
                    p={'sm'}
                    bg={'dark.8'}
                    style={{ borderRadius: '8px' }}
                    ref={ref}
                    h={(windowHeight - topHeight) * 0.6}
                  >
                    {anchor?.name === 'Earth' ? (
                      <EarthPanel
                        search={search}
                        onHover={(lat, long) => {
                          coordsToMapCoords(lat, long);
                        }}
                        onClick={(lat, long, alt, name) => {
                          setCoordinates({
                            lat,
                            long,
                            alt
                          });
                          setCustomName(name);
                          close();
                        }}
                      />
                    ) : (
                      <Text>No data for {anchor?.name}</Text>
                    )}
                  </Box>
                </div>
              )}
            </Transition>
          </Overlay>
        )}

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
