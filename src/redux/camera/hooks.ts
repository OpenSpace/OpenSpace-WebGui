import { shallowEqual } from 'react-redux';

import { useAppSelector } from '../hooks';

export function useCameraLatLong(decimals: number) {
  const { latitude, longitude, viewLatitude, viewLongitude, altitude, altitudeUnit } =
    useAppSelector((state) => {
      // Round to # decimal places
      const roundTo = (num: number | undefined, decimals: number) => {
        if (num === undefined) {
          return num;
        }
        return parseFloat(num.toFixed(decimals));
      };

      return {
        latitude: roundTo(state.camera.latitude, decimals),
        longitude: roundTo(state.camera.longitude, decimals),
        viewLatitude: roundTo(state.camera.viewLatitude, decimals),
        viewLongitude: roundTo(state.camera.viewLongitude, decimals),
        altitude: roundTo(state.camera.altitude, decimals),
        altitudeUnit: state.camera.altitudeUnit
      };
    }, shallowEqual);

  return { latitude, longitude, viewLatitude, viewLongitude, altitude, altitudeUnit };
}
