import { Group, Paper, Space } from '@mantine/core';

import { useGetPropertyOwner } from '@/api/hooks';
import { CollapsableContent } from '@/components/Collapse/CollapsableContent/CollapsableContent';
import { Property } from '@/components/Property/Property';
import { displayName } from '@/util/propertyTreeHelpers';

import { LayerList } from './LayersList';

interface Props {
  uri: string;
  globe: string;
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
    <CollapsableContent
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
    </CollapsableContent>
  );
}
