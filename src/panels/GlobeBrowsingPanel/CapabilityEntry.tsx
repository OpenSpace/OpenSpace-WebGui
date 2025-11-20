import { memo, useMemo } from 'react';
import { ActionIcon, Group, Menu, Tooltip } from '@mantine/core';

import { TruncatedText } from '@/components/TruncatedText/TruncatedText';
import {
  ColorPaletteIcon,
  DeleteIcon,
  LandscapeIcon,
  LayersIcon,
  NightIcon,
  PlusIcon,
  VerticalDotsIcon,
  WaterIcon
} from '@/icons/icons';

import { Capability, LayerType, layerTypes } from './types';
import { capabilityName } from './util';

interface Props {
  capability: Capability;
  activeLayers: Record<LayerType, string[]>;
  onAdd: (cap: Capability, layerType: LayerType) => void;
  onRemove: (name: string) => void;
}

interface LayerGroupData {
  id: LayerType;
  icon: React.JSX.Element;
  label: string;
}

/**
 * Even though this component is quite small and lightweight there can be thousands of
 * capability entries so to try and reduce some of the lag that occured we memo this
 * component.
 */
export const CapabilityEntry = memo(
  ({ capability, activeLayers, onAdd, onRemove }: Props) => {
    const layerGroups: LayerGroupData[] = useMemo(
      () => [
        {
          id: 'ColorLayers',
          icon: <ColorPaletteIcon />,
          label: 'Color layer'
        },
        {
          id: 'HeightLayers',
          icon: <LandscapeIcon />,
          label: 'Height layer'
        },
        {
          id: 'NightLayers',
          icon: <NightIcon />,
          label: 'Night layer'
        },
        {
          id: 'Overlays',
          icon: <LayersIcon />,
          label: 'Overlay layer'
        },
        {
          id: 'WaterMasks',
          icon: <WaterIcon />,
          label: 'Water Masks'
        }
      ],
      []
    );

    function isInLayer(layerType: LayerType) {
      const name = capabilityName(capability.Name);
      return activeLayers[layerType].includes(name);
    }

    const addedGroups = layerTypes.filter((layerType) => isInLayer(layerType));

    return (
      <Group gap={'xs'} justify={'space-between'} wrap={'nowrap'} align={'top'}>
        <TruncatedText flex={1} miw={150}>
          {capability.Name}
        </TruncatedText>
        {addedGroups.length > 0 && (
          <Tooltip label={'Remove all layers'}>
            <ActionIcon
              onClick={() => onRemove(capability.Name)}
              color={'red'}
              variant={'light'}
            >
              <DeleteIcon />
            </ActionIcon>
          </Tooltip>
        )}
        <Tooltip label={'Add as color layer'}>
          <ActionIcon
            onClick={() => onAdd(capability, 'ColorLayers')}
            disabled={isInLayer('ColorLayers')}
          >
            <PlusIcon />
          </ActionIcon>
        </Tooltip>
        <Menu position={'right-start'}>
          <Menu.Target>
            <ActionIcon>
              <VerticalDotsIcon />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Label>Add as:</Menu.Label>
            {layerGroups.map((group) => {
              const isInLayerGroup = isInLayer(group.id);
              return isInLayerGroup ? (
                <Tooltip label={'Layer is already added to this group'} key={group.id}>
                  <Menu.Item
                    leftSection={group.icon}
                    onClick={() => onAdd(capability, group.id)}
                    disabled
                  >
                    {group.label}
                  </Menu.Item>
                </Tooltip>
              ) : (
                <Menu.Item
                  leftSection={group.icon}
                  onClick={() => onAdd(capability, group.id)}
                  key={group.id}
                >
                  {group.label}
                </Menu.Item>
              );
            })}
          </Menu.Dropdown>
        </Menu>
      </Group>
    );
  }
);
