import { Group, Paper, Space } from '@mantine/core';

import { CollapsableContent } from '@/components/CollapsableContent/CollapsableContent';
import { Property } from '@/components/Property/Property';
import { useAppSelector } from '@/redux/hooks';
import { displayName } from '@/util/propertyTreeHelpers';

import { LayerList } from './LayersList';

interface Props {
  uri: string;
  globe: string;
  icon?: React.ReactNode;
}

export function GlobeLayerGroup({ uri, globe, icon }: Props) {
  const propertyOwner = useAppSelector(
    (state) => state.propertyOwners.propertyOwners[uri]
  );

  if (!propertyOwner) {
    throw Error(`No property owner found for uri: ${uri}`);
  }

  const layers = propertyOwner?.subowners || [];
  const properties = propertyOwner?.properties || [];

  return (
    <CollapsableContent
      title={
        <Group gap={'xs'}>
          {icon && icon}
          {displayName(propertyOwner!)}
        </Group>
      }
      noTransition
    >
      <Paper p={'xs'}>
        <LayerList layers={layers} layerGroup={propertyOwner.identifier} globe={globe} />
        <Space h={'xs'} />
        {properties.map((p) => (
          <Property key={p} uri={p} />
        ))}
      </Paper>
    </CollapsableContent>
  );
}
