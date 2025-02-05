import { Box, Card, Group } from '@mantine/core';

import { useGetPropertyOwner } from '@/api/hooks';
import { Collapsable } from '@/components/Collapsable/Collapsable';
import { Property } from '@/components/Property/Property';
import { Identifier, Uri } from '@/types/types';
import { displayName } from '@/util/propertyTreeHelpers';

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

  return (
    <Collapsable
      title={
        <Group gap={'xs'}>
          {icon && icon}
          {displayName(propertyOwner)}
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
