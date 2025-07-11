import { Box, Overlay, Transition } from '@mantine/core';
import { useClickOutside } from '@mantine/hooks';

import { GeoSearch } from './GeoSearch';

export function SearchOverlay({
  search,
  visible,
  close,
  h,
  setMouseMarker,
  setCoordinates,
  setCustomName
}: {
  search: string;
  h: number;
  visible: boolean;
  close: () => void;
  setMouseMarker: ({ x, y }: { x: number; y: number }) => void;
  setCoordinates: (coordinates: { lat: number; long: number; alt: number }) => void;
  setCustomName: (name: string) => void;
}) {
  const ref = useClickOutside(() => close());

  function coordsToMapCoords(latitude: number, longitude: number) {
    const x = (longitude + 180) / 360;
    const y = (90 - latitude) / 180;
    setMouseMarker({ x, y });
  }

  return (
    <>
      {visible && (
        <Overlay backgroundOpacity={0} blur={1}>
          <Transition
            mounted={visible}
            transition={'fade'}
            duration={400}
            timingFunction={'ease'}
          >
            {(styles) => (
              <div style={styles}>
                <Box
                  bd={'1px solid dark.5'}
                  mx={'sm'}
                  p={'sm'}
                  bg={'dark.8'}
                  style={{ borderRadius: '8px', overflow: 'auto' }}
                  ref={ref}
                  mah={h}
                >
                  <GeoSearch
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
                </Box>
              </div>
            )}
          </Transition>
        </Overlay>
      )}
    </>
  );
}
