import { useTranslation } from 'react-i18next';
import { Badge, Box, Group, Tabs, Text, ThemeIcon, Tooltip } from '@mantine/core';

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
  const { t } = useTranslation('panel-scene', {
    keyPrefix: 'scene-graph-node.node-view'
  });

  const propertyOwner = usePropertyOwner(uri);
  const { timeFrame, isInTimeFrame } = useTimeFrame(uri);

  // The SGN properties that are visible under the current user level setting
  const visibleProperties = useVisibleProperties(propertyOwner);

  if (!propertyOwner) {
    return (
      <Box m={'xs'}>
        <Text c={'dimmed'}>{t('not-found-info')}</Text>
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
      <Box>
        <SceneGraphNodeHeader uri={uri} />
      </Box>
      <Tabs mt={5} defaultValue={defaultTab}>
        <Tabs.List>
          <Tooltip
            label={
              hasRenderable
                ? t('renderable.tooltip.has-renderable')
                : t('renderable.tooltip.no-renderable')
            }
          >
            <Tabs.Tab value={TabKeys.Renderable} disabled={!hasRenderable}>
              {t('renderable.title')}
            </Tabs.Tab>
          </Tooltip>

          <Tooltip label={t('transform.tooltip')}>
            <Tabs.Tab value={TabKeys.Transform}>{t('transform.title')}</Tabs.Tab>
          </Tooltip>

          {timeFrame && (
            <Tooltip label={t('timeframe.tooltip')}>
              <Tabs.Tab value={TabKeys.TimeFrame}>
                <Group gap={5}>
                  {t('timeframe.title')}
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

          <Tooltip label={t('info.tooltip')}>
            <Tabs.Tab value={TabKeys.Info}> {t('info.title')}</Tabs.Tab>
          </Tooltip>

          {hasOther && (
            <Tooltip label={t('other.tooltip')}>
              <Tabs.Tab value={TabKeys.Other}>{t('other.title')}</Tabs.Tab>
            </Tooltip>
          )}
        </Tabs.List>

        <Tabs.Panel value={TabKeys.Renderable}>
          {hasRenderable ? (
            <Box mt={'xs'}>
              <PropertyOwnerContent uri={renderable} />
            </Box>
          ) : (
            <Text m={'xs'}>{t('renderable.tooltip.no-renderable')}</Text>
          )}
        </Tabs.Panel>

        <Tabs.Panel value={TabKeys.Transform} mt={'xs'}>
          {transforms.length > 0 ? (
            transforms.map((uri) => (
              <PropertyOwner key={uri} uri={uri} expandedOnDefault />
            ))
          ) : (
            <Text m={'xs'}>{t('transform.no-transform')}</Text>
          )}
        </Tabs.Panel>

        {/* @TODO (2025-03-19, emmbr): Add a way to display the different intervals that
            the time frame, as human readable time stamps */}
        {timeFrame && (
          <Tabs.Panel value={TabKeys.TimeFrame}>
            <Box p={'xs'}>
              <Group gap={'xs'}>
                <Text>{t('timeframe.status.label')}:</Text>
                <Tooltip
                  label={
                    isInTimeFrame
                      ? t('timeframe.status.tooltip.active')
                      : t('timeframe.status.tooltip.inactive')
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
                    {isInTimeFrame
                      ? t('timeframe.status.active')
                      : t('timeframe.status.inactive')}
                  </Badge>
                </Tooltip>
              </Group>
              <Text mt={'xs'} size={'sm'} c={'dimmed'}>
                {t('timeframe.info')}
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
