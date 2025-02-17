import { ActionIcon, Group, Text, Tooltip } from '@mantine/core';
import { computeDistanceBetween, LatLng } from 'spherical-geometry-js';

import { NodeNavigationButton } from '@/components/NodeNavigationButton/NodeNavigationButton';
import { MinusIcon, PlusIcon } from '@/icons/icons';
import { NavigationType } from '@/types/enums';
import { Identifier } from '@/types/types';

import { Candidate, Extent } from './types';
import { addressUTF8 } from './util';

interface Props {
  place: Candidate;
  isCustomAltitude: boolean;
  customAltitude: number;
  currentAnchor: Identifier;
  isSceneGraphNodeAdded: (identifier: Identifier) => boolean;
  addFocusNode: (identifier: Identifier, lat: number, long: number, alt: number) => void;
  removeFocusNode: (identifier: Identifier) => void;
}

export function EarthEntry({
  place,
  isCustomAltitude,
  customAltitude,
  currentAnchor,
  isSceneGraphNodeAdded,
  addFocusNode,
  removeFocusNode
}: Props) {
  const address = place.attributes.LongLabel;
  const addressUtf8 = addressUTF8(address);

  const isAdded = isSceneGraphNodeAdded(addressUtf8);
  const lat = place.location.y;
  const long = place.location.x;
  const alt = isCustomAltitude ? customAltitude * 1000 : calculateAltitude(place.extent);

  function calculateAltitude(extent: Extent): number {
    // Get lat long corners of polygon
    const nw = new LatLng(extent.yMax, extent.xMin);
    const ne = new LatLng(extent.yMax, extent.xMax);
    const sw = new LatLng(extent.yMin, extent.xMin);
    const se = new LatLng(extent.yMin, extent.xMax);
    // Distances are in meters
    const height = computeDistanceBetween(nw, sw);
    const lengthBottom = computeDistanceBetween(sw, se);
    const lengthTop = computeDistanceBetween(nw, ne);
    const maxLength = Math.max(lengthBottom, lengthTop);
    const largestDist = Math.max(height, maxLength);
    // 0.61 is the radian of 35 degrees - half of the standard horizontal field of view in OpenSpace
    return (0.5 * largestDist) / Math.tan(0.610865238);
  }

  return (
    <Group key={address} gap={'xs'} justify={'space-between'} w={'100%'}>
      <Tooltip label={address} withArrow openDelay={200}>
        <Text truncate flex={1}>
          {address}
        </Text>
      </Tooltip>

      <Group gap={'xs'} wrap={'nowrap'}>
        <NodeNavigationButton
          type={NavigationType.FlyGeo}
          identifier={currentAnchor}
          latitude={lat}
          longitude={long}
          altitude={alt}
        />
        <NodeNavigationButton
          type={NavigationType.JumpGeo}
          identifier={currentAnchor}
          latitude={lat}
          longitude={long}
          altitude={alt}
        />
        <ActionIcon
          onClick={() =>
            isAdded
              ? removeFocusNode(addressUtf8)
              : addFocusNode(addressUtf8, lat, long, alt)
          }
          color={isAdded ? 'red' : 'blue'}
        >
          {isAdded ? <MinusIcon /> : <PlusIcon />}
        </ActionIcon>
      </Group>
    </Group>
  );
}
