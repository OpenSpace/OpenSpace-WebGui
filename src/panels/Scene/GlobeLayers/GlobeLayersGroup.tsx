import { Group, Paper, Space } from '@mantine/core';

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
