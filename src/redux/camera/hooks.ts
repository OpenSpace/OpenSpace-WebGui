import { shallowEqual } from 'react-redux';

import { useAppSelector } from '../hooks';

export function useCameraLatLong(decimals: number) {
  const { latitude, longitude, viewLatitude, viewLongitude, altitude } = useAppSelector(
    (state) => {
      const { latitude, longitude, viewLatitude, viewLongitude, altitude } = state.camera;
      // Round to # decimal places
      const roundTo = (num: number | undefined, decimals: number) => {
        if (num === undefined) {
          return num;
        }
        return parseFloat(num.toFixed(decimals));
      };

      return {
        latitude: roundTo(latitude, decimals),
        longitude: roundTo(longitude, decimals),
        viewLatitude: roundTo(viewLatitude, decimals),
        viewLongitude: roundTo(viewLongitude, decimals),
        altitude: roundTo(altitude, decimals)
      };
    },
    shallowEqual
  );

  return { latitude, longitude, viewLatitude, viewLongitude, altitude };
}
