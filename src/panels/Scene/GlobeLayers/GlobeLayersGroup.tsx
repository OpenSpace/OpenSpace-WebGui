import { useTranslation } from 'react-i18next';
import { Badge, Box, Card, Group, Text } from '@mantine/core';

import { Collapsable } from '@/components/Collapsable/Collapsable';
import { Property } from '@/components/Property/Property';
import { usePropertyOwner } from '@/hooks/propertyOwner';
import { useAppSelector } from '@/redux/hooks';
import { Identifier, Uri } from '@/types/types';
import { displayName, isPropertyOwnerActive } from '@/util/propertyTreeHelpers';

import { LayerList } from './LayersList';

interface Props {
  uri: Uri;
  globe: Identifier;
  icon?: React.ReactNode;
}

export function GlobeLayerGroup({ uri, globe, icon }: Props) {
  const propertyOwner = usePropertyOwner(uri);
  const { t } = useTranslation('panel-scene', { keyPrefix: 'globe-layers.error' });

  if (!propertyOwner) {
    throw Error(t('no-property-owner', { uri }));
  }

  const { properties, subowners } = propertyOwner;
  const layers = subowners;

  const nActiveLayers = useAppSelector(
    (state) =>
      layers.filter((layer) => isPropertyOwnerActive(layer, state.properties.properties))
        .length
  );

  return (
    <Collapsable
      title={
        <Group gap={'xs'} wrap={'nowrap'}>
          <Box flex={'0 0 auto'}>{icon}</Box>
          <Group gap={'xs'}>
            {displayName(propertyOwner)}
            <Badge size={'sm'} variant={'default'}>
              {nActiveLayers > 0 && (
                <Text fw={'bold'} size={'xs'} span c={'green'}>
                  {nActiveLayers}
                </Text>
              )}
              <Text size={'xs'} span c={'dark.1'}>
                {nActiveLayers > 0 && ` / `}
                {layers.length}
              </Text>
            </Badge>
          </Group>
        </Group>
      }
      noTransition
    >
      <Card withBorder bg={'transparent'} mt={'xs'} p={'xs'} pl={0}>
        <LayerList layers={layers} layerGroup={propertyOwner.identifier} globe={globe} />
      </Card>

      <Box m={'xs'}>
        {properties.map((propertyUri) => (
          <Property key={propertyUri} uri={propertyUri} />
        ))}
      </Box>
    </Collapsable>
  );
}
