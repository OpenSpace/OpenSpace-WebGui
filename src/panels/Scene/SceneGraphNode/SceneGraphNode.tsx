import { Tabs } from '@mantine/core';

import { PropertyOwner } from '@/components/PropertyOwner/PropertyOwner';
import { useAppSelector } from '@/redux/hooks';
import { PropertyOwner as PropertyOwnerType } from '@/types/types';

import { SceneGraphNodeHeader } from './SceneGraphNodeHeader';

interface Props {
  uri: string;
}

export function SceneGraphNode({ uri }: Props) {
  const propertyOwner = useAppSelector(
    (state) => state.propertyOwners.propertyOwners[uri]
  );

  const propertyOwners = useAppSelector((state) => state.propertyOwners.propertyOwners);
  const subOwnerDataMap: { [id: string]: PropertyOwnerType } = {};
  propertyOwner?.subowners.forEach((subowner) => {
    const owner = propertyOwners[subowner]!;
    subOwnerDataMap[owner.identifier] = owner;
  });

  // We know that all scene graph nodes have the same subowners
  const tabsData = {
    Renderable: subOwnerDataMap.Renderable,
    Transform: [
      subOwnerDataMap.Scale,
      subOwnerDataMap.Translation,
      subOwnerDataMap.Rotation
    ],
    Other: propertyOwner?.properties
  };

  const TabKeys = {
    Renderable: 'Renderable',
    Transform: 'Transform',
    Other: 'Other'
  };

  return (
    <>
      <SceneGraphNodeHeader uri={uri} />
      <Tabs variant={'outline'} defaultValue={TabKeys.Renderable}>
        <Tabs.List>
          <Tabs.Tab value={TabKeys.Renderable}>{TabKeys.Renderable}</Tabs.Tab>
          <Tabs.Tab value={TabKeys.Transform}>{TabKeys.Transform}</Tabs.Tab>
          <Tabs.Tab value={TabKeys.Other}>{TabKeys.Other}</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value={TabKeys.Renderable} p={'sm'}>
          <PropertyOwner uri={tabsData.Renderable.uri} withHeader={false} />
        </Tabs.Panel>

        <Tabs.Panel value={TabKeys.Transform} p={'sm'}>
          {tabsData.Transform.map((subowner) => (
            <PropertyOwner
              key={subowner.identifier}
              uri={subowner.uri}
              expandedOnDefault
            />
          ))}
        </Tabs.Panel>

        <Tabs.Panel value={TabKeys.Other} p={'sm'}>
          <PropertyOwner uri={uri} withHeader={false} hideSubOwners />
        </Tabs.Panel>
      </Tabs>
    </>
  );
}
