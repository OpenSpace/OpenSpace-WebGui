import { memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ActionIcon, Group, Menu, Tooltip } from '@mantine/core';

import { DecoratedIcon } from '@/components/DecoratedIcon/DecoratedIcon';
import { MaybeTooltip } from '@/components/MaybeTooltip/MaybeTooltip';
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
import { makeIdentifier } from '@/util/text';

import { Capability, LayerType, layerTypes } from './types';

interface Props {
  capability: Capability;
  addedLayers: Record<LayerType, string[]>;
  onAdd: (cap: Capability, layerType: LayerType) => void;
  onRemove: (name: string) => void;
}

interface LayerGroupData {
  id: LayerType;
  icon: React.JSX.Element;
  label: string;
}

/**
 * Represents a layer entry from the WTMS server
 *
 * Even though this component is quite small and lightweight there can be thousands of
 * capability enstries so to try and reduce some of the lag that occured we memo this
 * component.
 */
export const CapabilityEntry = memo(
  ({ capability, addedLayers, onAdd, onRemove }: Props) => {
    const addedGroups = layerTypes.filter((layerType) => isInLayerGroup(layerType));

    const { t } = useTranslation('panel-globebrowsing', {
      keyPrefix: 'capability-entry'
    });

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
          label: 'Water mask'
        }
      ],
      []
    );

    function isInLayerGroup(layerType: LayerType) {
      const name = makeIdentifier(capability.Name);
      return addedLayers[layerType].includes(name);
    }

    return (
      <Group
        gap={'xs'}
        justify={'space-between'}
        wrap={'nowrap'}
        align={'top'}
        style={{ borderBottom: '1px solid var(--mantine-color-dark-5)' }}
        pt={2}
        pb={5}
      >
        <TruncatedText flex={1} miw={150}>
          {capability.Name}
        </TruncatedText>
        {addedGroups.length > 0 && (
          <Tooltip label={t('tooltips.remove-layers')}>
            <ActionIcon
              onClick={() => onRemove(capability.Name)}
              color={'red'}
              variant={'light'}
            >
              <DeleteIcon />
            </ActionIcon>
          </Tooltip>
        )}
        <Tooltip label={t('tooltips.add-color-layer')}>
          <ActionIcon
            onClick={() => onAdd(capability, 'ColorLayers')}
            disabled={isInLayerGroup('ColorLayers')}
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
            <Menu.Label>{t('menu-add-label')}</Menu.Label>
            {layerGroups.map((group) => (
              <MaybeTooltip
                showTooltip={isInLayerGroup(group.id)}
                label={t('tooltips.layer-exists')}
                key={group.id}
              >
                <Menu.Item
                  key={group.id}
                  onClick={() => onAdd(capability, group.id)}
                  leftSection={<DecoratedIcon>{group.icon}</DecoratedIcon>}
                  disabled={isInLayerGroup(group.id)}
                >
                  {group.label}
                </Menu.Item>
              </MaybeTooltip>
            ))}
          </Menu.Dropdown>
        </Menu>
      </Group>
    );
  }
);
