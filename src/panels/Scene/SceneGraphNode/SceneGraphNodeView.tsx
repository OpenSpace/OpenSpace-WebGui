import { Badge, Box, Group, Tabs, Text, ThemeIcon, Tooltip } from '@mantine/core';

import { Layout } from '@/components/Layout/Layout';
import { PropertyOwner } from '@/components/PropertyOwner/PropertyOwner';
import { PropertyOwnerContent } from '@/components/PropertyOwner/PropertyOwnerContent';
import { ScrollBox } from '@/components/ScrollBox/ScrollBox';
import {
  usePropertyOwner,
  useTimeFrame,
  useVisibleProperties
} from '@/hooks/propertyOwner';
import { ClockIcon, ClockOffIcon } from '@/icons/icons';
import { IconSize } from '@/types/enums';
import { Uri } from '@/types/types';
import { isRenderable, isSgnTransform } from '@/util/propertyTreeHelpers';

import { SceneGraphNodeHeader } from './SceneGraphNodeHeader';
import { SceneGraphNodeMetaInfo } from './SceneGraphNodeMetaInfo';

import styles from './SceneGraphNodeView.module.css';

interface Props {
  uri: Uri;
  // Extra content to be shown at the top right of the view
  extraTopControls?: React.ReactNode;
  showOpenInNewWindow?: boolean;
}

export function SceneGraphNodeView({
  uri,
  extraTopControls,
  showOpenInNewWindow = true
}: Props) {
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
    <Layout>
      <Layout.FixedSection>
        <Group
          gap={'xs'}
          pb={'xs'}
          pl={'xs'}
          grow
          preventGrowOverflow={false}
          wrap={'nowrap'}
        >
          {/* The key here is necessary to make sure that the component is re-rendered
          when the anchor node changes, to trigger the animation */}
          <Box key={uri} className={styles.highlight}>
            <SceneGraphNodeHeader uri={uri} showOpenInNewWindow={showOpenInNewWindow} />
          </Box>
          {extraTopControls}
        </Group>
      </Layout.FixedSection>
      <Layout.GrowingSection>
        <ScrollBox h={'100%'}>
          <Tabs defaultValue={defaultTab} mt={'xs'}>
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

              <Tooltip
                label={'Properties that control the position, scale, and orientation'}
              >
                <Tabs.Tab value={TabKeys.Transform}>Transform</Tabs.Tab>
              </Tooltip>

              {timeFrame && (
                <Tooltip
                  label={
                    'Information about the time frame for when the object is visible'
                  }
                >
                  <Tabs.Tab value={TabKeys.TimeFrame}>
                    <Group gap={5}>
                      Time
                      <ThemeIcon
                        variant={'transparent'}
                        size={'compact-xs'}
                        color={isInTimeFrame ? 'green' : 'red'}
                      >
                        {isInTimeFrame ? (
                          <ClockIcon size={IconSize.xs} />
                        ) : (
                          <ClockOffIcon size={IconSize.xs} />
                        )}
                      </ThemeIcon>
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
                    The object will not be visible outside the specified time range.
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
        </ScrollBox>
      </Layout.GrowingSection>
    </Layout>
  );
}
