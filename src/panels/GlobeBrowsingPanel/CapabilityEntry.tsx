import { ActionIcon, Box, Group, Tooltip } from '@mantine/core';
import { Capability, LayerType } from './types';
import { TruncatedText } from '@/components/TruncatedText/TruncatedText';
import {
  ColorPaletteIcon,
  LandscapeIcon,
  LayersIcon,
  NightIcon,
  WaterIcon
} from '@/icons/icons';

interface Props {
  capability: Capability;
  onClick: (cap: Capability, layerType: LayerType) => void;
}

export function CapabilityEntry({ capability, onClick }: Props) {
  if (capability.Name === '' && capability.URL === '') return;

  const layerGroups: {
    id: LayerType;
    icon: React.JSX.Element;
    tooltip: string;
  }[] = [
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
  ];

  return (
    <Group gap={'xs'} justify="space-between" wrap="nowrap" align="top">
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
              >
                {group.icon}
              </ActionIcon>
            </Tooltip>
          ))}
        </Group>
      </Box>
    </Group>
  );
}
