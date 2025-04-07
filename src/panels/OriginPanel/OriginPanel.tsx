import { useMemo, useState } from 'react';
import { Center, Group, SegmentedControl, Text, VisuallyHidden } from '@mantine/core';

import { generateMatcherFunctionByKeys } from '@/components/FilterList/util';
import { Layout } from '@/components/Layout/Layout';
import { useSceneGraphNodes } from '@/hooks/propertyOwner';
import { AnchorIcon, FocusIcon, TelescopeIcon } from '@/icons/icons';
import { useAppSelector } from '@/redux/hooks';
import { EngineMode, IconSize } from '@/types/enums';
import { NavigationAimKey, NavigationAnchorKey } from '@/util/keys';
import { hasInterestingTag } from '@/util/propertyTreeHelpers';

import { AnchorAimView } from './AnchorAimView/AnchorAimView';
import { FocusView } from './FocusView/FocusView';
import { OriginSettings } from './OriginSettings';

enum NavigationMode {
  Focus = 'Focus',
  AnchorAim = 'Anchor & Aim'
}

export function OriginPanel() {
  const propertyOwners = useAppSelector((state) => state.propertyOwners.propertyOwners);
  const engineMode = useAppSelector((state) => state.engineMode.mode);

  // @TODO (2024-04-04, emmbr): This can be removed once the mark nodes PR (#155) is
  // merged, but for now we need a list of all nodes in addition to the filtered
  // searchable ones
  const allSceneGraphNodes = useSceneGraphNodes();

  const searchableNodes = useSceneGraphNodes({
    includeHidden: false,
    includeNonFocusable: false
  });

  const shouldStartInAnchorAim = useAppSelector((state) => {
    const aimProp = state.properties.properties[NavigationAimKey];
    const anchorProp = state.properties.properties[NavigationAnchorKey];
    return aimProp?.value !== anchorProp?.value && aimProp?.value !== '';
  });
  const [navigationMode, setNavigationMode] = useState(
    shouldStartInAnchorAim ? NavigationMode.AnchorAim : NavigationMode.Focus
  );

  const sortedDefaultList = useMemo(() => {
    const markedInterestingNodeUris = allSceneGraphNodes.filter((node) =>
      hasInterestingTag(node.uri, propertyOwners)
    );
    const favorites = markedInterestingNodeUris.filter((po) => po !== undefined);
    return favorites.slice().sort((a, b) => a.name.localeCompare(b.name));
  }, [propertyOwners, allSceneGraphNodes]);

  const sortedSearchableNodes = useMemo(
    () => searchableNodes.sort((a, b) => a.name.localeCompare(b.name)),
    [searchableNodes]
  );

  const searchMatcherFunction = generateMatcherFunctionByKeys([
    'identifier',
    'name',
    'uri',
    'tags'
  ]);

  const isInFlight = engineMode === EngineMode.CameraPath;

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
                    <VisuallyHidden>Focus mode</VisuallyHidden>
                  </Center>
                )
              },
              {
                value: NavigationMode.AnchorAim,
                label: (
                  <Center h={20}>
                    <AnchorIcon />
                    <Text c={'dimmed'} size={'sm'}>
                      /
                    </Text>
                    <TelescopeIcon />
                    <VisuallyHidden>Anchor & Aim mode</VisuallyHidden>
                  </Center>
                )
              }
            ]}
          />
          <OriginSettings />
        </Group>
      </Layout.FixedSection>
      <Layout.GrowingSection>
        {navigationMode === NavigationMode.Focus && (
          <FocusView
            favorites={sortedDefaultList}
            searchableNodes={sortedSearchableNodes}
            matcherFunction={searchMatcherFunction}
          />
        )}
        {navigationMode === NavigationMode.AnchorAim && (
          <AnchorAimView
            favorites={sortedDefaultList}
            searchableNodes={sortedSearchableNodes}
            matcherFunction={searchMatcherFunction}
          />
        )}
      </Layout.GrowingSection>
    </Layout>
  );
}
