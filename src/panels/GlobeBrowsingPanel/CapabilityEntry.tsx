import { memo, useMemo } from 'react';
import { ActionIcon, Box, Group, Tooltip } from '@mantine/core';

import { TruncatedText } from '@/components/TruncatedText/TruncatedText';
import {
  ColorPaletteIcon,
  LandscapeIcon,
  LayersIcon,
  NightIcon,
  WaterIcon
} from '@/icons/icons';

import { Capability, LayerType } from './types';
import { capabilityName } from './util';

interface Props {
  capability: Capability;
  activeLayers: Record<LayerType, string[]>;
  onClick: (cap: Capability, layerType: LayerType) => void;
}

/**
 * Even though this component is quite small and lightweight there can be thousands of
 * capability entries so to try and reduce some of the lag that occured we memo this
 * component.
 */
export const CapabilityEntry = memo(({ capability, activeLayers, onClick }: Props) => {
  const layerGroups: {
    id: LayerType;
    icon: React.JSX.Element;
    tooltip: string;
  }[] = useMemo(
    () => [
      {
        id: 'ColorLayers',
        icon: <ColorPaletteIcon />,
        tooltip: 'Add to color layers'
      },
      {
        id: 'HeightLayers',
        icon: <LandscapeIcon />,
        tooltip: 'Add to height layers'
      },
      {
        id: 'NightLayers',
        icon: <NightIcon />,
        tooltip: 'Add to night layers'
      },
      {
        id: 'Overlays',
        icon: <LayersIcon />,
        tooltip: 'Add to overlay layers'
      },
      {
        id: 'WaterMasks',
        icon: <WaterIcon />,
        tooltip: 'Add to water layers'
      }
    ],
    []
  );

  function isInLayer(layerType: LayerType) {
    const name = capabilityName(capability.Name);
    return activeLayers[layerType].includes(name);
  }

  return (
    <Group gap={'xs'} justify={'space-between'} wrap={'nowrap'} align={'top'}>
      <TruncatedText flex={1} miw={150}>
        {capability.Name}
      </TruncatedText>
      <Box>
        <Group gap={2}>
          {layerGroups.map((group) => (
            <Tooltip label={group.tooltip} key={group.id}>
              <ActionIcon
                onClick={() => onClick(capability, group.id)}
                aria-label={group.tooltip}
                color={isInLayer(group.id) ? 'green' : 'white'}
                variant={'light'}
              >
                {group.icon}
              </ActionIcon>
            </Tooltip>
          ))}
        </Group>
      </Box>
    </Group>
  );
});
