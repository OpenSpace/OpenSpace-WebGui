import { Box, Space, Tabs, Text } from '@mantine/core';

import { useGetPropertyOwner, useGetVisibleProperties } from '@/api/hooks';
import { PropertyOwner } from '@/components/PropertyOwner/PropertyOwner';
import { useAppSelector } from '@/redux/hooks';
import { PropertyOwner as PropertyOwnerType } from '@/types/types';

import { SceneGraphNodeHeader } from './SceneGraphNodeHeader';
import { SceneGraphNodeMetaInfo } from './SceneGraphNodeMetaInfo';

interface Props {
  uri: string;
}

export function SceneGraphNodeView({ uri }: Props) {
  const propertyOwner = useGetPropertyOwner(uri);

  if (!propertyOwner) {
    throw Error(`No property owner found for SGN with uri: ${uri}`);
  }

  const propertyOwners = useAppSelector((state) => state.propertyOwners.propertyOwners);

  // The SGN properties that are visible under the current user level setting
  const visibleProperties = useGetVisibleProperties(propertyOwner);

  const TabKeys = {
    Renderable: 'Renderable',
    Transform: 'Transform',
    Other: 'Other',
    Info: 'Info'
  };

  // We know that all scene graph nodes have the same subowners. However, not all of them
  // are guaranteed to exist
  const subowners: {
    Renderable?: PropertyOwnerType;
    Scale?: PropertyOwnerType;
    Translation?: PropertyOwnerType;
    Rotation?: PropertyOwnerType;
  } = {};

  propertyOwner.subowners.forEach((subowner) => {
    const owner = propertyOwners[subowner];
    if (owner) {
      subowners[owner.identifier as keyof typeof subowners] = owner;
    }
  });

  // Group the transforms under one tab, in the following order. Only show the transforms
  // that are actually present
  const transforms = [subowners.Scale, subowners.Translation, subowners.Rotation].filter(
    (t) => t !== undefined
  );

  const hasRenderable = subowners.Renderable !== undefined;
  const hasOther = visibleProperties.length > 0;
  const defaultTab = hasRenderable ? TabKeys.Renderable : TabKeys.Transform;

  // @TODO (emmbr, 2024-12-04): Include information about the Parent node under Transform,
  // To communicate which transforms it inherits. However, first we need to get that
  // information from OpenSpace. Should probably only be shown is the user level is
  // advanced or higher

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
        {subowners.Renderable && (
          <Tabs.Panel value={TabKeys.Renderable}>
            <PropertyOwner uri={subowners.Renderable.uri} withHeader={false} />
          </Tabs.Panel>
        )}
        <Tabs.Panel value={TabKeys.Transform}>
          {transforms.length > 0 ? (
            transforms.map((subowner) => (
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
