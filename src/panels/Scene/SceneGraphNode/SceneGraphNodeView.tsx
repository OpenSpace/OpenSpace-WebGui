import { Badge, Box, Group, Tabs, Text, Tooltip } from '@mantine/core';

import { PropertyOwner } from '@/components/PropertyOwner/PropertyOwner';
import { PropertyOwnerContent } from '@/components/PropertyOwner/PropertyOwnerContent';
import { usePropertyOwner, useVisibleProperties } from '@/hooks/propertyOwner';
import { ClockIcon, ClockOffIcon } from '@/icons/icons';
import { IconSize } from '@/types/enums';
import { Uri } from '@/types/types';
import { isRenderable, isSgnTransform } from '@/util/propertyTreeHelpers';

import { useTimeFrame } from '../hooks';

import { SceneGraphNodeHeader } from './SceneGraphNodeHeader';
import { SceneGraphNodeMetaInfo } from './SceneGraphNodeMetaInfo';

interface Props {
  uri: Uri;
}

export function SceneGraphNodeView({ uri }: Props) {
  const propertyOwner = usePropertyOwner(uri);
  const { timeFrame, isInTimeFrame } = useTimeFrame(uri);

  // The SGN properties that are visible under the current user level setting
  const visibleProperties = useVisibleProperties(propertyOwner);

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

  enum TabKeys {
    Renderable = 'renderable',
    Transform = 'transform',
    Other = 'other',
    Info = 'info',
    TimeFrame = 'timeframe'
  }

  const renderable = propertyOwner.subowners.find((uri) => isRenderable(uri));
  const hasRenderable = renderable !== undefined;

  // Group the transforms under one tab
  const transforms = propertyOwner.subowners.filter((uri) => isSgnTransform(uri));

  const defaultTab = hasRenderable ? TabKeys.Renderable : TabKeys.Transform;
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
              hasRenderable
                ? 'Properties that control the visuals of this object'
                : 'This scene graph node has no renderable'
            }
          >
            <Tabs.Tab value={TabKeys.Renderable} disabled={!hasRenderable}>
              Renderable
            </Tabs.Tab>
          </Tooltip>

          <Tooltip label={'Properties that control the position, scale, and orientation'}>
            <Tabs.Tab value={TabKeys.Transform}>Transform</Tabs.Tab>
          </Tooltip>

          {timeFrame && (
            <Tooltip label={'The time frame of the scene graph node'}>
              <Tabs.Tab value={TabKeys.TimeFrame}>
                <Group gap={5}>
                  Time
                  {isInTimeFrame ? (
                    <ClockIcon size={IconSize.xs} />
                  ) : (
                    <ClockOffIcon size={IconSize.xs} />
                  )}
                </Group>
              </Tabs.Tab>
            </Tooltip>
          )}

          <Tooltip label={'Information about the scene graph node and its asset'}>
            <Tabs.Tab value={TabKeys.Info}>Info</Tabs.Tab>
          </Tooltip>

          {hasOther && (
            <Tooltip label={'Other properties of the scene graph node'}>
              <Tabs.Tab value={TabKeys.Other}>Other</Tabs.Tab>
            </Tooltip>
          )}
        </Tabs.List>

        <Tabs.Panel value={TabKeys.Renderable}>
          {hasRenderable ? (
            <Box mt={'xs'}>
              <PropertyOwnerContent uri={renderable} />
            </Box>
          ) : (
            <Text m={'xs'}>This scene graph node has no renderable.</Text>
          )}
        </Tabs.Panel>

        <Tabs.Panel value={TabKeys.Transform} mt={'xs'}>
          {transforms.length > 0 ? (
            transforms.map((uri) => (
              <PropertyOwner key={uri} uri={uri} expandedOnDefault />
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
              <Group gap={'xs'}>
                <Text>Current status:</Text>
                <Tooltip
                  label={
                    isInTimeFrame
                      ? 'This object is currently active and will be visible'
                      : 'This object is currently inactive due to its time frame and will not be visible'
                  }
                  multiline
                  maw={300}
                >
                  <Badge
                    size={'lg'}
                    rightSection={
                      isInTimeFrame ? (
                        <ClockIcon size={IconSize.xs} />
                      ) : (
                        <ClockOffIcon size={IconSize.xs} />
                      )
                    }
                    variant={'outline'}
                    color={isInTimeFrame ? 'green' : 'red'}
                  >
                    {isInTimeFrame ? 'Active' : 'Inactive'}
                  </Badge>
                </Tooltip>
              </Group>
              <Text mt={'xs'} size={'sm'} c={'dimmed'}>
                The object will not be visible outside the time range specified below.
              </Text>
            </Box>
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
