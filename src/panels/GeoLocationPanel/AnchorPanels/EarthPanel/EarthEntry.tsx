import { useTranslation } from 'react-i18next';
import { ActionIcon, Group, Text, Tooltip } from '@mantine/core';
import { computeDistanceBetween, LatLng } from 'spherical-geometry-js';

import { NodeNavigationButton } from '@/components/NodeNavigationButton/NodeNavigationButton';
import { MinusIcon, PlusIcon } from '@/icons/icons';
import { NavigationType } from '@/types/enums';

import { Candidate, Extent } from './types';
import { addressUTF8 } from '../../util';
import { useIsSceneGraphNodeAdded } from '@/hooks/propertyOwner';
import { useCreateSceneGraphNode } from '../../hooks';
import { useRemoveSceneGraphNodeModal } from '@/util/useRemoveSceneGraphNode';
import { useAnchorNode } from '@/util/propertyTreeHooks';

interface Props {
  place: Candidate;
  useCustomAltitude: boolean;
  customAltitude: number;
}

const EarthGlobeIdentifier = 'Earth';

export function EarthEntry({ place, useCustomAltitude, customAltitude }: Props) {
  const isSceneGraphNodeAdded = useIsSceneGraphNodeAdded();
  const addSceneGraphNode = useCreateSceneGraphNode();
  const removesceneGraphNode = useRemoveSceneGraphNodeModal();
  const anchor = useAnchorNode();

  const { t } = useTranslation('panel-geolocation', {
    keyPrefix: 'earth-panel.earth-entry-aria-label'
  });
  const address = place.attributes.LongLabel;
  const identifier = addressUTF8(address);

  const isSgnAdded = isSceneGraphNodeAdded(identifier);
  const lat = place.location.y;
  const long = place.location.x;
  const alt = useCustomAltitude ? customAltitude * 1000 : calculateAltitude(place.extent);

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
    <Group key={address} gap={'xs'} justify={'space-between'} w={'100%'}>
      <Tooltip label={address} withArrow openDelay={200}>
        <Text truncate flex={1}>
          {address}
        </Text>
      </Tooltip>

      <Group gap={'xs'} wrap={'nowrap'}>
        <NodeNavigationButton
          type={NavigationType.FlyGeo}
          identifier={EarthGlobeIdentifier}
          latitude={lat}
          longitude={long}
          altitude={alt}
        />
        <NodeNavigationButton
          type={NavigationType.JumpGeo}
          identifier={EarthGlobeIdentifier}
          latitude={lat}
          longitude={long}
          altitude={alt}
        />
        <Tooltip
          label={
            isSgnAdded ? t('remove', { name: address }) : t('add', { name: address })
          }
        >
          <ActionIcon
            onClick={() =>
              isSgnAdded
                ? removesceneGraphNode(identifier)
                : addSceneGraphNode(EarthGlobeIdentifier, identifier, lat, long, alt)
            }
            color={isSgnAdded ? 'red' : 'blue'}
            variant={'subtle'}
            aria-label={
              isSgnAdded ? t('remove', { name: address }) : t('add', { name: address })
            }
            disabled={anchor?.identifier === identifier}
          >
            {isSgnAdded ? <MinusIcon /> : <PlusIcon />}
          </ActionIcon>
        </Tooltip>
      </Group>
    </Group>
  );
}
