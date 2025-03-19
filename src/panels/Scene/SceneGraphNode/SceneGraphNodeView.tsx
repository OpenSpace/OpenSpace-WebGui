import { Box, Divider, Tabs, Text, Tooltip } from '@mantine/core';

import { useGetPropertyOwner, useGetVisibleProperties } from '@/api/hooks';
import { PropertyOwner } from '@/components/PropertyOwner/PropertyOwner';
import { PropertyOwnerContent } from '@/components/PropertyOwner/PropertyOwnerContent';
import { useAppSelector } from '@/redux/hooks';
import { TransformType } from '@/types/enums';
import { Uri } from '@/types/types';
import {
  getSgnRenderable,
  getSgnTimeframe,
  getSgnTransform
} from '@/util/propertyTreeHelpers';

import { SceneGraphNodeHeader } from './SceneGraphNodeHeader';
import { SceneGraphNodeMetaInfo } from './SceneGraphNodeMetaInfo';

interface Props {
  uri: Uri;
}

export function SceneGraphNodeView({ uri }: Props) {
  const propertyOwner = useGetPropertyOwner(uri);
  const propertyOwners = useAppSelector((state) => state.propertyOwners.propertyOwners);

  // The SGN properties that are visible under the current user level setting
  const visibleProperties = useGetVisibleProperties(propertyOwner);

  if (!propertyOwner) {
    return (
      <Box m={'xs'}>
        <Text c={'dimmed'}>
          This scene graph node does not exist. It might have been removed since this view
          was opened.
        </Text>
      </Box>
    );
  }

  // We know that all scene graph nodes have the same subowners. However, not all of them
  // are guaranteed to exist, so each of these may be undefined
  const renderable = getSgnRenderable(propertyOwner, propertyOwners);
  const scale = getSgnTransform(propertyOwner, TransformType.Scale, propertyOwners);
  const translation = getSgnTransform(
    propertyOwner,
    TransformType.Translation,
    propertyOwners
  );
  const rotation = getSgnTransform(propertyOwner, TransformType.Rotation, propertyOwners);

  // Group the transforms under one tab, in the following order. Only show the transforms
  // that are actually present
  const transforms = [scale, translation, rotation].filter((t) => t !== undefined);

  const timeFrame = getSgnTimeframe(propertyOwner, propertyOwners);

  enum TabKeys {
    Renderable = 'renderable',
    Transform = 'transform',
    Other = 'other',
    Info = 'info',
    TimeFrame = 'timeframe'
  }

  const defaultTab = renderable ? TabKeys.Renderable : TabKeys.Transform;
  const hasOther = visibleProperties.length > 0;

  return (
    <>
      <Box mt={'xs'} mb={'xs'}>
        <SceneGraphNodeHeader uri={uri} />
      </Box>{' '}
      <Tabs mt={'xs'} defaultValue={defaultTab}>
        <Tabs.List>
          <Tooltip
            label={
              renderable
                ? 'Properties that control the visuals of this object'
                : 'This scene graph node has no renderable'
            }
          >
            <Tabs.Tab value={TabKeys.Renderable} disabled={!renderable}>
              Renderable
            </Tabs.Tab>
          </Tooltip>

          <Tooltip label={'Properties that control the position, scale, and orientation'}>
            <Tabs.Tab value={TabKeys.Transform}>Transform</Tabs.Tab>
          </Tooltip>

          <Tooltip label={'Information about the scene graph node and its asset'}>
            <Tabs.Tab value={TabKeys.Info}>Info</Tabs.Tab>
          </Tooltip>

          {timeFrame && (
            <Tooltip label={'The time frame of the scene graph node'}>
              <Tabs.Tab value={TabKeys.TimeFrame}>Time Frame</Tabs.Tab>
            </Tooltip>
          )}

          {hasOther && (
            <Tooltip label={'Other properties of the scene graph node'}>
              <Tabs.Tab value={TabKeys.Other}>Other</Tabs.Tab>
            </Tooltip>
          )}
        </Tabs.List>

        <Tabs.Panel value={TabKeys.Renderable}>
          {renderable ? (
            <PropertyOwnerContent uri={renderable.uri} />
          ) : (
            <Text m={'xs'}>This scene graph node has no renderable.</Text>
          )}
        </Tabs.Panel>

        <Tabs.Panel value={TabKeys.Transform} mt={'xs'}>
          {transforms.length > 0 ? (
            transforms.map((subowner) => (
              <PropertyOwner
                key={subowner.identifier}
                uri={subowner.uri}
                expandedOnDefault
              />
            ))
          ) : (
            <Text m={'xs'}>This scene graph node has no transform</Text>
          )}
        </Tabs.Panel>

        {/* @TODO (2025-03-19, emmbr): Add a way to display the different intervals that
            the time frame, as human readable time stamps */}
        {timeFrame && (
          <Tabs.Panel value={TabKeys.TimeFrame}>
            <Box p={'xs'}>
              <Text>
                This object will only be visible during the time frame for which it is
                active.
              </Text>
            </Box>
            <Divider my={'xs'} />
            <PropertyOwner uri={timeFrame.uri} />
          </Tabs.Panel>
        )}

        {hasOther && (
          <Tabs.Panel value={TabKeys.Other}>
            {/* This tab shows the properties scene graph node, without any of the
                subowners */}
            <PropertyOwnerContent uri={uri} hideSubowners />
          </Tabs.Panel>
        )}

        <Tabs.Panel value={TabKeys.Info}>
          <SceneGraphNodeMetaInfo uri={uri} />
        </Tabs.Panel>
      </Tabs>
    </>
  );
}
