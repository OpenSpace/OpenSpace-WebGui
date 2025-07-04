import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Center, Group, SegmentedControl, Text, VisuallyHidden } from '@mantine/core';

import { useSearchKeySettings } from '@/components/FilterList/SearchSettingsMenu/hook';
import { generateMatcherFunctionByKeys } from '@/components/FilterList/util';
import { Layout } from '@/components/Layout/Layout';
import { LoadingBlocks } from '@/components/LoadingBlocks/LoadingBlocks';
import { RecordingPlaybackOverlay } from '@/components/RecordingPlaybackOverlay/RecordingPlaybackOverlay';
import { useSceneGraphNodes } from '@/hooks/sceneGraphNodes/hooks';
import { useSubscribeToEngineMode } from '@/hooks/topicSubscriptions';
import { AnchorIcon, FocusIcon, TelescopeIcon } from '@/icons/icons';
import { useAppSelector } from '@/redux/hooks';
import { EngineMode, IconSize } from '@/types/enums';
import { PropertyOwner } from '@/types/types';
import { NavigationAimKey, NavigationAnchorKey } from '@/util/keys';
import { useFeaturedNodes } from '@/util/propertyTreeHooks';

import { AnchorAimView } from './AnchorAimView/AnchorAimView';
import { FocusView } from './FocusView/FocusView';
import { NavigationSettings } from './NavigationSettings';

enum NavigationMode {
  Focus = 'Focus',
  AnchorAim = 'Anchor & Aim'
}

export function NavigationPanel() {
  const shouldStartInAnchorAim = useAppSelector((state) => {
    const aimProp = state.properties.properties[NavigationAimKey];
    const anchorProp = state.properties.properties[NavigationAnchorKey];
    return aimProp?.value !== anchorProp?.value && aimProp?.value !== '';
  });

  const showOnlyFocusable = useAppSelector(
    (state) => state.local.menus.navigation.onlyFocusable
  );

  const [navigationMode, setNavigationMode] = useState(
    shouldStartInAnchorAim ? NavigationMode.AnchorAim : NavigationMode.Focus
  );

  const engineMode = useSubscribeToEngineMode();

  const { t } = useTranslation('panel-navigation');

  const { allowedSearchKeys, toggleSearchKey, selectedSearchKeys } =
    useSearchKeySettings<PropertyOwner>({
      name: true,
      identifier: false,
      tags: false,
      uri: false
    });

  const featuredNodes = useFeaturedNodes();

  // @TODO (2024-04-08, emmbr): Expose these filters to the user? Could also include tags
  const searchableNodes = useSceneGraphNodes({
    includeGuiHiddenNodes: false,
    onlyFocusable: showOnlyFocusable
  });
  const isLoading = searchableNodes.length === 0;

  const sortedSearchableNodes = useMemo(
    () => searchableNodes.slice().sort((a, b) => a.name.localeCompare(b.name)),
    [searchableNodes]
  );
  const defaultList = featuredNodes.length > 0 ? featuredNodes : sortedSearchableNodes;

  const searchMatcherFunction = generateMatcherFunctionByKeys(selectedSearchKeys);

  const isInFlight = engineMode === EngineMode.CameraPath;

  if (isLoading) {
    return <LoadingBlocks />;
  }

  return (
    <Layout>
      <Layout.FixedSection>
        <Group justify={'space-between'} gap={'xs'} wrap={'nowrap'}>
          <SegmentedControl
            value={navigationMode}
            disabled={isInFlight}
            my={'xs'}
            onChange={(value) => setNavigationMode(value as NavigationMode)}
            data={[
              {
                value: NavigationMode.Focus,
                label: (
                  <Center h={20}>
                    <FocusIcon size={IconSize.sm} />
                    <VisuallyHidden>{t('aria-labels.focus-mode')}</VisuallyHidden>
                  </Center>
                )
              },
              {
                value: NavigationMode.AnchorAim,
                label: (
                  <Center h={20}>
                    <AnchorIcon />
                    <Text c={'dimmed'} size={'sm'} aria-hidden>
                      /
                    </Text>
                    <TelescopeIcon />
                    <VisuallyHidden>{t('aria-labels.anchor-aim-mode')}</VisuallyHidden>
                  </Center>
                )
              }
            ]}
          />
          <NavigationSettings />
        </Group>
      </Layout.FixedSection>
      <Layout.GrowingSection>
        {navigationMode === NavigationMode.Focus && (
          <FocusView
            favorites={defaultList}
            searchableNodes={sortedSearchableNodes}
            matcherFunction={searchMatcherFunction}
            toggleKey={toggleSearchKey}
            allowedKeys={allowedSearchKeys}
          />
        )}
        {navigationMode === NavigationMode.AnchorAim && (
          <AnchorAimView
            favorites={defaultList}
            searchableNodes={sortedSearchableNodes}
            matcherFunction={searchMatcherFunction}
            toggleKey={toggleSearchKey}
            allowedKeys={allowedSearchKeys}
          />
        )}
      </Layout.GrowingSection>
      <RecordingPlaybackOverlay text={t('cannot-change-on-playback')} />
    </Layout>
  );
}
