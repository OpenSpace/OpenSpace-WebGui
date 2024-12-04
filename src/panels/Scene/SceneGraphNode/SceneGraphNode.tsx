import { Box, Space, Tabs, Text } from '@mantine/core';
import { shallowEqual } from '@mantine/hooks';

import { useGetOptionPropertyValue, useSubscribeToProperty } from '@/api/hooks';
import { PropertyOwner } from '@/components/PropertyOwner/PropertyOwner';
import { useAppSelector } from '@/redux/hooks';
import { PropertyOwner as PropertyOwnerType } from '@/types/types';
import { EnginePropertyVisibilityKey } from '@/util/keys';
import { isPropertyVisible } from '@/util/propertyTreeHelpers';

import { SceneGraphNodeHeader } from './SceneGraphNodeHeader';
import { SceneGraphNodeMetaInfo } from './SceneGraphNodeMetaInfo';

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

  const visiblityLevelSetting = useGetOptionPropertyValue(EnginePropertyVisibilityKey);
  useSubscribeToProperty(EnginePropertyVisibilityKey);

  // @TODO (emmbr, 2024-12-03) Would be nice if we didn't have to use a selector for this.
  // The reason we do is that the state.properties.properties object includes the property
  // values, and hence updates on every property change. One idea would be to seprate the
  // property values from the property descriptions in the redux store.
  const visibleProperties =
    useAppSelector(
      (state) =>
        propertyOwner?.properties.filter((p) =>
          isPropertyVisible(
            state.properties.properties[p]?.description,
            visiblityLevelSetting
          )
        ),
      shallowEqual
    ) || [];

  // We know that all scene graph nodes have the same subowners
  const tabsData = {
    Renderable: subOwnerDataMap.Renderable,
    Transform: [
      subOwnerDataMap.Scale,
      subOwnerDataMap.Translation,
      subOwnerDataMap.Rotation
    ],
    Other: visibleProperties
  };

  // Not all transforms are guaranteed to exist
  tabsData.Transform = tabsData.Transform.filter((transform) => transform !== undefined);

  const TabKeys = {
    Renderable: 'Renderable',
    Transform: 'Transform',
    Other: 'Other',
    Info: 'Info'
  };

  const hasRenderable = tabsData.Renderable !== undefined;
  const hasOther = tabsData.Other.length > 0;
  const defaultTab = hasRenderable ? TabKeys.Renderable : TabKeys.Transform;

  // @TODO (emmbr, 2024-12-04): Include information about the Parent node under Transform,
  // To communicate which transforms it inherits. However, first we need to get that
  // information from OpenSpace

  return (
    <Box m={'xs'}>
      <SceneGraphNodeHeader uri={uri} />
      <Space h={'xs'} />
      <Tabs variant={'outline'} defaultValue={defaultTab}>
        <Tabs.List>
          {hasRenderable && (
            <Tabs.Tab value={TabKeys.Renderable}>{TabKeys.Renderable}</Tabs.Tab>
          )}
          <Tabs.Tab value={TabKeys.Transform}>{TabKeys.Transform}</Tabs.Tab>
          {hasOther && <Tabs.Tab value={TabKeys.Other}>{TabKeys.Other}</Tabs.Tab>}
          <Tabs.Tab value={TabKeys.Info}>{TabKeys.Info}</Tabs.Tab>
        </Tabs.List>
        {hasRenderable && (
          <Tabs.Panel value={TabKeys.Renderable}>
            <PropertyOwner uri={tabsData.Renderable!.uri} withHeader={false} />
          </Tabs.Panel>
        )}
        <Tabs.Panel value={TabKeys.Transform}>
          {tabsData.Transform.length > 0 ? (
            tabsData.Transform.map((subowner) => (
              <PropertyOwner
                key={subowner.identifier}
                uri={subowner.uri}
                expandedOnDefault
              />
            ))
          ) : (
            <Text>This scene graph node has no transform</Text>
          )}
        </Tabs.Panel>
        {hasOther && (
          <Tabs.Panel value={TabKeys.Other}>
            <PropertyOwner uri={uri} withHeader={false} hideSubOwners />
          </Tabs.Panel>
        )}
        <Tabs.Panel value={TabKeys.Info}>
          <SceneGraphNodeMetaInfo uri={uri} />
        </Tabs.Panel>
      </Tabs>
    </Box>
  );
}
