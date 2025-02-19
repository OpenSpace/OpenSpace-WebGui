import { useMemo, useState } from 'react';
import {
  Box,
  Button,
  Center,
  Container,
  Group,
  Paper,
  ScrollArea,
  SegmentedControl,
  Text,
  VisuallyHidden
} from '@mantine/core';

import { useOpenSpaceApi } from '@/api/hooks';
import { useComputeHeightFunction } from '@/components/FilterList/hooks';
import { generateMatcherFunctionByKeys } from '@/components/FilterList/util';
import { AirplaneCancelIcon, AnchorIcon, FocusIcon, TelescopeIcon } from '@/icons/icons';
import { useAppSelector } from '@/redux/hooks';
import { EngineMode, IconSize } from '@/types/enums';
import { Uri } from '@/types/types';
import { NavigationAimKey, NavigationAnchorKey } from '@/util/keys';
import { hasInterestingTag, isPropertyOwnerHidden } from '@/util/propertyTreeHelpers';

import { AnchorAimView } from './AnchowAimView';
import { FocusView } from './FocusView';
import { OriginSettings } from './OriginSettings';
import { RemainingFlightTimeIndicator } from './RemainingFlightTimeIndicator';

enum NavigationMode {
  Focus = 'Focus',
  AnchorAim = 'Anchor & Aim'
}

export function OriginPanel() {
  const propertyOwners = useAppSelector((state) => state.propertyOwners.propertyOwners);
  const properties = useAppSelector((state) => state.properties.properties);
  const engineMode = useAppSelector((state) => state.engineMode.mode);

  const luaApi = useOpenSpaceApi();
  const { ref, heightFunction } = useComputeHeightFunction(300, 20);

  const searchMatcherFunction = generateMatcherFunctionByKeys([
    'identifier',
    'name',
    'uri',
    'tags'
  ]);

  const shouldStartInAnchorAim = useAppSelector((state) => {
    const aimProp = state.properties.properties[NavigationAimKey];
    const anchorProp = state.properties.properties[NavigationAnchorKey];
    return aimProp?.value !== anchorProp?.value && aimProp?.value !== '';
  });
  const [navigationMode, setNavigationMode] = useState(
    shouldStartInAnchorAim ? NavigationMode.AnchorAim : NavigationMode.Focus
  );

  const sortedDefaultList = useMemo(() => {
    const uris: Uri[] = propertyOwners.Scene?.subowners ?? [];
    const markedInterestingNodeUris = uris.filter((uri) =>
      hasInterestingTag(uri, propertyOwners)
    );
    const favorites = markedInterestingNodeUris
      .map((uri) => propertyOwners[uri])
      .filter((po) => po !== undefined);
    return favorites.slice().sort((a, b) => a.name.localeCompare(b.name));
  }, [propertyOwners]);

  // @TODO: Remove dependency on properties object
  const sortedSearchableNodes = useMemo(() => {
    const uris: Uri[] = propertyOwners.Scene?.subowners ?? [];
    const allNodes = uris
      .map((uri) => propertyOwners[uri])
      .filter((po) => po !== undefined);

    // Searchable nodes are all nodes that are not hidden in the GUI
    const searchableNodes = allNodes.filter((node) => {
      return !isPropertyOwnerHidden(node.uri, properties);
    });

    return searchableNodes.slice().sort((a, b) => a.name.localeCompare(b.name));
  }, [properties, propertyOwners]);

  const isInFlight = engineMode === EngineMode.CameraPath;

  // // TODO: anden88: @emma take a look at this. Is the flgiht controller really needed for this?
  // function onSelect(
  //   identifier: Identifier,
  //   event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  // ) {
  //   const updateViewPayload: FlightControllerData = {
  //     type: 'updateView',
  //     focus: '',
  //     aim: '',
  //     anchor: '',
  //     resetVelocities: false,
  //     retargetAnchor: false,
  //     retargetAim: false
  //   };

  // switch (navigationAction) {
  //   case NavigationActionState.Focus:
  //     updateViewPayload.focus = identifier;
  //     updateViewPayload.aim = '';
  //     updateViewPayload.anchor = '';
  //     break;
  //   case NavigationActionState.Anchor:
  //     if (!aim) {
  //       updateViewPayload.aim = anchor ?? '';
  //     }
  //     updateViewPayload.anchor = identifier;
  //     break;
  //   case NavigationActionState.Aim:
  //     updateViewPayload.aim = identifier;
  //     updateViewPayload.anchor = anchor ?? '';
  //     break;
  //   default:
  //     throw new Error(`Missing NavigationActionState case for: '${navigationAction}'`);
  // }

  // if (!event.shiftKey) {
  //   if (navigationAction === NavigationActionState.Aim) {
  //     triggerRetargetAim();
  //   } else {
  //     triggerRetargetAnchor();
  //   }
  // }

  //   const shouldRetargetAim = !event.shiftKey && updateViewPayload.aim !== '';
  //   const shouldRetargetAnchor = !event.shiftKey && updateViewPayload.aim === '';

  //   updateViewPayload.retargetAim = shouldRetargetAim;
  //   updateViewPayload.retargetAnchor = shouldRetargetAnchor;
  //   updateViewPayload.resetVelocities = !event.ctrlKey;

  //   dispatch(sendFlightControl(updateViewPayload));

  //   if (updateViewPayload.aim) {
  //     setAnchor(updateViewPayload.anchor);
  //     setAim(updateViewPayload.aim);
  //   } else if (updateViewPayload.anchor !== '') {
  //     setAnchor(updateViewPayload.anchor);
  //   } else {
  //     setAnchor(updateViewPayload.focus);
  //     setAim(updateViewPayload.aim);
  //   }
  // }

  return (
    <ScrollArea h={'100%'}>
      <Container>
        <Box ref={ref}>
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
          {isInFlight && (
            <Paper mb={'xs'} py={'xs'}>
              <Center>
                <Group gap={'xs'}>
                  <RemainingFlightTimeIndicator compact={false} />
                  <Button
                    onClick={() => luaApi?.pathnavigation.stopPath()}
                    leftSection={<AirplaneCancelIcon size={IconSize.md} />}
                    variant={'outline'}
                    color={'red'}
                  >
                    Cancel Flight
                  </Button>
                </Group>
              </Center>
            </Paper>
          )}
        </Box>
        {navigationMode === NavigationMode.Focus && (
          <FocusView
            heightFunction={heightFunction}
            favorites={sortedDefaultList}
            searchableNodes={sortedSearchableNodes}
            matcherFunction={searchMatcherFunction}
          />
        )}
        {navigationMode === NavigationMode.AnchorAim && (
          <AnchorAimView
            heightFunction={heightFunction}
            favorites={sortedDefaultList}
            searchableNodes={sortedSearchableNodes}
            matcherFunction={searchMatcherFunction}
          />
        )}
      </Container>
    </ScrollArea>
  );
}
