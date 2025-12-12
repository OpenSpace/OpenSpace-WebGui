import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { ActionIcon, Group, Menu, Tooltip } from '@mantine/core';

import { DecoratedIcon } from '@/components/DecoratedIcon/DecoratedIcon';
import { MaybeTooltip } from '@/components/MaybeTooltip/MaybeTooltip';
import { TruncatedText } from '@/components/TruncatedText/TruncatedText';
import { layerGroups } from '@/data/GlobeLayers';
import { DeleteIcon, PlusIcon, VerticalDotsIcon } from '@/icons/icons';
import { LayerType, layerTypes } from '@/types/globeLayers';
import { makeIdentifier } from '@/util/text';

import { Capability } from './types';

interface Props {
  capability: Capability;
  addedLayers: Record<LayerType, string[]>;
  onAdd: (cap: Capability, layerType: LayerType) => void;
  onRemove: (name: string) => void;
}

/**
 * Represents a layer entry from the WTMS server.
 *
 * Even though this component is quite small and lightweight there can be thousands of
 * capability entries so to try and reduce some of the lag that occurred we memo this
 * component.
 */
export const CapabilityEntry = memo(
  ({ capability, addedLayers, onAdd, onRemove }: Props) => {
    const { t } = useTranslation('panel-globeimagerybrowser', {
      keyPrefix: 'capability-entry'
    });

    const addedGroups = layerTypes.filter((layerType) => isInLayerGroup(layerType));

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
