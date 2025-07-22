import { Identifier } from '@/types/types';
import { GeoLocationGroupKey } from '@/util/keys';

export function addressUTF8(address: string): string {
  // Converts the string to utf-8 format removing any illegal characters
  // \x00-\x7F matches characters between index 0 and index 127, also replaces any
  // space, ',', and '.' characters
  // eslint-disable-next-line no-control-regex
  return address.replace(/[^\x00-\x7F]/g, '').replace(/[\s,.]/g, '_');
}

export function createSceneGraphNodeTable(
  globe: Identifier,
  identifier: Identifier,
  lat: number,
  long: number,
  alt: number
) {
  return {
    Identifier: identifier,
    Parent: globe,
    Transform: {
      Translation: {
        Type: 'GlobeTranslation',
        Globe: globe,
        Latitude: lat,
        Longitude: long,
        // Altitude is set to zero, to put the node on the surface of the globe. This is
        // needed for nicely flying to it (showing the globe in focus).
        // @TODO (2025-07-22, emmbr) We should come up with a better solution for this,
        // so that we can set the altitude to the actual altitude of the place
        Altitude: 0
      }
    },
    // Instead, we add the altitude to the interaction sphere, so that it limits how close
    // we can move to the planet
    InteractionSphere: alt,
    GUI: {
      Path: GeoLocationGroupKey
    }
  };
}
