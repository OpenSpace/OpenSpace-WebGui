import { shallowEqual } from 'react-redux';

import { useAppSelector } from '../hooks';
import { roundTo } from '@/util/numeric';

export function useCameraLatLong(decimals: number) {
  const { latitude, longitude, viewLatitude, viewLongitude, altitude, altitudeUnit } =
    useAppSelector((state) => {
      return {
        latitude: state.camera.latitude && roundTo(state.camera.latitude, decimals),
        longitude: state.camera.longitude && roundTo(state.camera.longitude, decimals),
        viewLatitude: state.camera.viewLatitude && roundTo(state.camera.viewLatitude, decimals),
        viewLongitude: state.camera.viewLongitude && roundTo(state.camera.viewLongitude, decimals),
        altitude: state.camera.altitude && roundTo(state.camera.altitude, decimals),
        altitudeUnit: state.camera.altitudeUnit
      };
    }, shallowEqual);

  return { latitude, longitude, viewLatitude, viewLongitude, altitude, altitudeUnit };
}
