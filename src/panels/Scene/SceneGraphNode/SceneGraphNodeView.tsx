import { Box, CloseButton, Group, Tabs, Text, Tooltip } from '@mantine/core';

import { Layout } from '@/components/Layout/Layout';
import { PropertyOwner } from '@/components/PropertyOwner/PropertyOwner';
import { PropertyOwnerContent } from '@/components/PropertyOwner/PropertyOwnerContent';
import { ScrollBox } from '@/components/ScrollBox/ScrollBox';
import { usePropertyOwner, useVisibleProperties } from '@/hooks/propertyOwner';
import { useAppDispatch } from '@/redux/hooks';
import { setSceneTreeSelectedNode } from '@/redux/local/localSlice';
import { Uri } from '@/types/types';
import { isRenderable, isSgnTransform } from '@/util/propertyTreeHelpers';

import { SceneGraphNodeHeader } from './SceneGraphNodeHeader';
import { SceneGraphNodeMetaInfo } from './SceneGraphNodeMetaInfo';

import styles from './SceneGraphNodeView.module.css';

interface Props {
  uri: Uri;
}

export function SceneGraphNodeView({ uri }: Props) {
  const propertyOwner = usePropertyOwner(uri);

  // The SGN properties that are visible under the current user level setting
  const visibleProperties = useVisibleProperties(propertyOwner);
  const dispatch = useAppDispatch();

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
    Info = 'info'
  }

  const renderable = propertyOwner.subowners.find((uri) => isRenderable(uri));

  // Group the transforms under one tab
  const transforms = propertyOwner.subowners.filter((uri) => isSgnTransform(uri));

  const hasRenderable = renderable !== undefined;

  const defaultTab = hasRenderable ? TabKeys.Renderable : TabKeys.Transform;
  const hasOther = visibleProperties.length > 0;

  return (
    <Layout>
      <Layout.FixedSection>
        <Group pt={'xs'} pb={'sm'} grow preventGrowOverflow={false}>
          {/* // The key here is necessary to make sure that the component is re-rendered when the
        // anchor node changes, to trigger the animation */}
          <Box key={uri} className={styles.highlight}>
            <SceneGraphNodeHeader uri={uri} />
          </Box>
          <CloseButton
            flex={0}
            onClick={() => dispatch(setSceneTreeSelectedNode(null))}
          />
        </Group>
      </Layout.FixedSection>
      <Layout.GrowingSection>
        <ScrollBox h={'100%'}>
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

              <Tooltip
                label={'Properties that control the position, scale, and orientation'}
              >
                <Tabs.Tab value={TabKeys.Transform}>Transform</Tabs.Tab>
              </Tooltip>

              {hasOther && (
                <Tooltip label={'Other properties of the scene graph node'}>
                  <Tabs.Tab value={TabKeys.Other}>Other</Tabs.Tab>
                </Tooltip>
              )}

              <Tooltip label={'Information about the scene graph node and its asset'}>
                <Tabs.Tab value={TabKeys.Info}>Info</Tabs.Tab>
              </Tooltip>
            </Tabs.List>

            <Tabs.Panel value={TabKeys.Renderable}>
              {hasRenderable ? (
                <PropertyOwnerContent uri={renderable} />
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
