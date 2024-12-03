import { Group, Paper, Space } from '@mantine/core';

import { CollapsableContent } from '@/components/CollapsableContent/CollapsableContent';
import { Property } from '@/components/Property/Property';
import { useAppSelector } from '@/redux/hooks';
import { displayName } from '@/util/propertyTreeHelpers';

import { GlobeLayer } from './GlobeLayer';

interface Props {
  uri: string;
  icon?: React.ReactNode;
}

export function GlobeLayerGroup({ uri, icon }: Props) {
  const propertyOwner = useAppSelector(
    (state) => state.propertyOwners.propertyOwners[uri]
  );

  const layers = propertyOwner?.subowners;
  const properties = propertyOwner?.properties;

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
      {/* TODO: Implement reordering of layers */}
      <Paper p={'xs'}>
        {layers?.map((layer) => <GlobeLayer key={layer} uri={layer} />)}
        <Space h={'xs'} />
        {properties?.map((p) => <Property key={p} uri={p} />)}
      </Paper>
    </CollapsableContent>
  );
}
