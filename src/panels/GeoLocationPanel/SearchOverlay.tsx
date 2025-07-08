import { Box, Overlay, Transition } from '@mantine/core';
import { EarthPanel } from './AnchorPanels/EarthPanel/EarthPanel';
import { useClickOutside } from '@mantine/hooks';

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
    setMouseMarker({
      x: (longitude + 180) / 360,
      y: (90 - latitude) / 180
    });
  }
  return (
    <>
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
                  h={h}
                >
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
                </Box>
              </div>
            )}
          </Transition>
        </Overlay>
      )}
    </>
  );
}
