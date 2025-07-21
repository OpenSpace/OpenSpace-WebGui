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
        Altitude: 0
      }
    },
    InteractionSphere: 0,
    BoundingSphere: alt,
    GUI: {
      Path: GeoLocationGroupKey
    }
  };
}
