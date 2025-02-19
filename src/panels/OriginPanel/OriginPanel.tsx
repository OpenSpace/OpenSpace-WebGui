import { useState } from 'react';
import {
  Box,
  Button,
  Center,
  Container,
  Group,
  Paper,
  ScrollArea,
  SegmentedControl,
  ThemeIcon
} from '@mantine/core';

import { useGetStringPropertyValue, useOpenSpaceApi } from '@/api/hooks';
import { useComputeHeightFunction } from '@/components/FilterList/hooks';
import { generateMatcherFunctionByKeys } from '@/components/FilterList/util';
import { AirplaneCancelIcon, AnchorIcon, FocusIcon, TelescopeIcon } from '@/icons/icons';
import { useAppSelector } from '@/redux/hooks';
import { EngineMode, IconSize } from '@/types/enums';
import { Uri } from '@/types/types';
import { NavigationAnchorKey } from '@/util/keys';
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
  const luaApi = useOpenSpaceApi();

  const [navigationMode, setNavigationMode] = useState(NavigationMode.Focus);

  const propertyOwners = useAppSelector((state) => state.propertyOwners.propertyOwners);
  const properties = useAppSelector((state) => state.properties.properties);
  const engineMode = useAppSelector((state) => state.engineMode.mode);

  const [anchor] = useGetStringPropertyValue(NavigationAnchorKey);
  // const [aim, setAim] = useGetStringPropertyValue(NavigationAimKey);
  // const triggerRetargetAnchor = useTriggerProperty(RetargetAnchorKey);
  // const triggerRetargetAim = useTriggerProperty(RetargetAimKey);

  const { ref, heightFunction } = useComputeHeightFunction(300, 20);

  const searchMatcherFunction = generateMatcherFunctionByKeys([
    'identifier',
    'name',
    'uri',
    'tags'
  ]);

  const uris: Uri[] = propertyOwners.Scene?.subowners ?? [];
  const allNodes = uris
    .map((uri) => propertyOwners[uri])
    .filter((po) => po !== undefined);

  const urisWithTags = uris.filter((uri) => hasInterestingTag(uri, propertyOwners));
  const favorites = urisWithTags
    .map((uri) => propertyOwners[uri])
    .filter((po) => po !== undefined);

  const defaultList = favorites.slice();

  // Make sure current anchor is in default list
  let anchorNode = undefined;
  if (anchor) {
    anchorNode = allNodes.find((node) => node.identifier === anchor);
    if (anchorNode && !defaultList.find((owner) => owner.identifier === anchor)) {
      defaultList.push(anchorNode);
    }
  }

  // Searchable nodes are all nodes that are not hidden in the GUI
  const searchableNodes = allNodes.filter((node) => {
    return !isPropertyOwnerHidden(node.uri, properties);
  });

  const sortedDefaultList = defaultList
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name));

  const sortedNodes = searchableNodes
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name));

  // // Make sure current anchor is in default list
  // if (anchor && !defaultList.find((owner) => owner.identifier === anchor)) {
  //   const anchorNode = allNodes.find((node) => node.identifier === anchor);
  //   if (anchorNode) {
  //     defaultList.push(anchorNode);
  //   }
  // }

  // // Make sure current aim is in the default list
  // if (hasDistinctAim() && !defaultList.find((owner) => owner.identifier === aim)) {
  //   const aimNode = allNodes.find((node) => node.identifier === aim);
  //   if (aimNode) {
  //     defaultList.push(aimNode);
  //   }
  // }

  const isInFlight = engineMode === EngineMode.CameraPath;

  // function hasDistinctAim() {
  //   return aim !== '' && aim !== anchor;
  // }

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
                    <ThemeIcon variant={'transparent'}>
                      <FocusIcon size={IconSize.sm} aria-label={'Set Focus'} />
                    </ThemeIcon>
                  )
                },
                {
                  value: NavigationMode.AnchorAim,
                  label: (
                    <ThemeIcon variant={'transparent'}>
                      <AnchorIcon size={IconSize.sm} />
                      <TelescopeIcon size={IconSize.sm} />
                    </ThemeIcon>
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
            searchableNodes={sortedNodes}
            matcherFunction={searchMatcherFunction}
          />
        )}
        {navigationMode === NavigationMode.AnchorAim && (
          <AnchorAimView
            heightFunction={heightFunction}
            favorites={sortedDefaultList}
            searchableNodes={sortedNodes}
            matcherFunction={searchMatcherFunction}
          />
        )}
      </Container>
    </ScrollArea>
  );
}
