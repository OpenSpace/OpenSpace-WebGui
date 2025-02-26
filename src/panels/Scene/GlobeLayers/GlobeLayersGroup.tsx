import { Badge, Box, Group, Paper, Space, Text } from '@mantine/core';

import { useGetPropertyOwner } from '@/api/hooks';
import { Collapsable } from '@/components/Collapsable/Collapsable';
import { Property } from '@/components/Property/Property';
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
  const propertyOwner = useGetPropertyOwner(uri);

  if (!propertyOwner) {
    throw Error(`No property owner found for uri: ${uri}`);
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
      <Paper p={'xs'}>
        <LayerList layers={layers} layerGroup={propertyOwner.identifier} globe={globe} />
        <Space h={'xs'} />
        {properties.map((propertyUri) => (
          <Property key={propertyUri} uri={propertyUri} />
        ))}
      </Paper>
    </Collapsable>
  );
}
