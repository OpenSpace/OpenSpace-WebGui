import { ActionIcon, Group, Text } from '@mantine/core';
import { computeDistanceBetween, LatLng } from 'spherical-geometry-js';

import { NodeNavigationButton } from '@/components/NodeNavigationButton/NodeNavigationButton';
import { MinusIcon, PlusIcon } from '@/icons/icons';
import { NavigationType } from '@/types/enums';
import { Candidate, Extent } from '@/types/types';

import { addressUTF8 } from './util';

interface Props {
  place: Candidate;
  isCustomAltitude: boolean;
  customAltitude: number;
  currentAnchor: string;
  isSceneGraphNodeAdded: (identifier: string) => boolean;
  addFocusNode: (identifier: string, lat: number, long: number, alt: number) => void;
  removeFocusNode: (identifier: string) => void;
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
  const cappedAddress = address; // TODO cap address to some fixed size?
  const lat = place.location.y;
  const long = place.location.x;
  const alt = isCustomAltitude ? customAltitude * 1000 : calculateAltitude(place.extent);

  function calculateAltitude(extent: Extent): number {
    // Get lat long corners of polygon
    const nw = new LatLng(extent.ymax, extent.xmin);
    const ne = new LatLng(extent.ymax, extent.xmax);
    const sw = new LatLng(extent.ymin, extent.xmin);
    const se = new LatLng(extent.ymin, extent.xmax);
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
    <Group key={address} gap={'xs'} mb={2} justify={'space-between'} wrap={'nowrap'}>
      {/* TODO temporary css to stop long names from linebreaking causing the
          buttons to be moved to a new row, the maxwidth is just arbitrary
          minus the size of the buttons... */}
      <Text
        style={{
          flexGrow: 1,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          textWrap: 'nowrap',
          maxWidth: 350 - 125
        }}
      >
        {cappedAddress}
        {cappedAddress.length !== address.length ? '...' : ''}
      </Text>

      <Group gap={'xs'} wrap={'nowrap'}>
        <NodeNavigationButton
          type={NavigationType.FlyGeo}
          identifier={currentAnchor}
          lat={lat}
          long={long}
          alt={alt}
        />
        <NodeNavigationButton
          type={NavigationType.JumpGeo}
          identifier={currentAnchor}
          lat={lat}
          long={long}
          alt={alt}
        />
        <ActionIcon
          onClick={() =>
            isAdded
              ? removeFocusNode(addressUtf8)
              : addFocusNode(addressUtf8, lat, long, alt)
          }
          size={'lg'}
          color={isAdded ? 'red' : 'blue'}
        >
          {isAdded ? <MinusIcon /> : <PlusIcon />}
        </ActionIcon>
      </Group>
    </Group>
  );
}
