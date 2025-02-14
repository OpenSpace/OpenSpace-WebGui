import { useRef, useState } from 'react';
import {
  Box,
  Button,
  Center,
  Container,
  Group,
  Paper,
  ScrollArea,
  SegmentedControl,
  VisuallyHidden
} from '@mantine/core';

import {
  useGetStringPropertyValue,
  useOpenSpaceApi,
  useTriggerProperty
} from '@/api/hooks';
import { FilterList } from '@/components/FilterList/FilterList';
import { generateMatcherFunctionByKeys } from '@/components/FilterList/util';
import { AirplaneCancelIcon, AnchorIcon, FocusIcon, TelescopeIcon } from '@/icons/icons';
import { sendFlightControl } from '@/redux/flightcontroller/flightControllerMiddleware';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { EngineMode, IconSize } from '@/types/enums';
import { FlightControllerData } from '@/types/flightcontroller-types';
import { Identifier, PropertyOwner, Uri } from '@/types/types';
import {
  NavigationAimKey,
  NavigationAnchorKey,
  RetargetAimKey,
  RetargetAnchorKey
} from '@/util/keys';
import { hasInterestingTag, isPropertyOwnerHidden } from '@/util/propertyTreeHelpers';

import { FocusEntry } from './FocusEntry';
import { OriginSettings } from './OriginSettings';
import { RemainingFlightTimeIndicator } from './RemainingFlightTimeIndicator';

enum NavigationActionState {
  Focus = 'Focus',
  Anchor = 'Anchor',
  Aim = 'Aim'
}

export function OriginPanel() {
  const luaApi = useOpenSpaceApi();

  const [navigationAction, setNavigationAction] = useState(NavigationActionState.Focus);

  const propertyOwners = useAppSelector((state) => state.propertyOwners.propertyOwners);
  const properties = useAppSelector((state) => state.properties.properties);
  const engineMode = useAppSelector((state) => state.engineMode.mode);

  const [anchor, setAnchor] = useGetStringPropertyValue(NavigationAnchorKey);
  const [aim, setAim] = useGetStringPropertyValue(NavigationAimKey);
  const triggerRetargetAnchor = useTriggerProperty(RetargetAnchorKey);
  const triggerRetargetAim = useTriggerProperty(RetargetAimKey);

  const dispatch = useAppDispatch();
  const ref = useRef<HTMLDivElement | null>(null);

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
  if (anchor && !defaultList.find((owner) => owner.identifier === anchor)) {
    const anchorNode = allNodes.find((node) => node.identifier === anchor);
    if (anchorNode) {
      defaultList.push(anchorNode);
    }
  }

  // Make sure current aim is in the default list
  if (hasDistinctAim() && !defaultList.find((owner) => owner.identifier === aim)) {
    const aimNode = allNodes.find((node) => node.identifier === aim);
    if (aimNode) {
      defaultList.push(aimNode);
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

  const searchPlaceholderText = {
    Focus: 'Search for a new focus...',
    Anchor: 'Search for a new anchor...',
    Aim: 'Search for a new aim...'
  }[navigationAction];

  const isInFocusMode = navigationAction === NavigationActionState.Focus;
  // We'll highlight the anchor node in both Focus and Anchor state otherwise aim node
  const activeNode = navigationAction === NavigationActionState.Aim ? aim : anchor;
  const isInFlight = engineMode === EngineMode.CameraPath;

  function hasDistinctAim() {
    return aim !== '' && aim !== anchor;
  }

  function onSelect(
    identifier: Identifier,
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    const updateViewPayload: FlightControllerData = {
      type: 'updateView',
      focus: '',
      aim: '',
      anchor: '',
      resetVelocities: false,
      retargetAnchor: false,
      retargetAim: false
    };

    switch (navigationAction) {
      case NavigationActionState.Focus:
        updateViewPayload.focus = identifier;
        updateViewPayload.aim = '';
        updateViewPayload.anchor = '';
        break;
      case NavigationActionState.Anchor:
        if (!aim) {
          updateViewPayload.aim = anchor ?? '';
        }
        updateViewPayload.anchor = identifier;
        break;
      case NavigationActionState.Aim:
        updateViewPayload.aim = identifier;
        updateViewPayload.anchor = anchor ?? '';
        break;
      default:
        throw new Error(`Missing NavigationActionState case for: '${navigationAction}'`);
    }

    if (!event.shiftKey) {
      if (navigationAction === NavigationActionState.Aim) {
        triggerRetargetAim();
      } else {
        triggerRetargetAnchor();
      }
    }

    const shouldRetargetAim = !event.shiftKey && updateViewPayload.aim !== '';
    const shouldRetargetAnchor = !event.shiftKey && updateViewPayload.aim === '';

    updateViewPayload.retargetAim = shouldRetargetAim;
    updateViewPayload.retargetAnchor = shouldRetargetAnchor;
    updateViewPayload.resetVelocities = !event.ctrlKey;

    dispatch(sendFlightControl(updateViewPayload));

    if (updateViewPayload.aim) {
      setAnchor(updateViewPayload.anchor);
      setAim(updateViewPayload.aim);
    } else if (updateViewPayload.anchor !== '') {
      setAnchor(updateViewPayload.anchor);
    } else {
      setAnchor(updateViewPayload.focus);
      setAim(updateViewPayload.aim);
    }
  }

  function computeHeight(height: number): number {
    if (!ref.current) {
      return height * 0.5; // A fallback option in case we have no ref yet
    }
    // TODO (ylvse 2025-01-21): make this bottom margin a mantine variable somehow?
    // Same for minSize
    const bottomMargin = 40;
    const minSize = 300;
    const filterListHeight = height - ref.current.clientHeight - bottomMargin;
    return Math.max(filterListHeight, minSize);
  }

  return (
    <ScrollArea h={'100%'}>
      <Container>
        <Box ref={ref}>
          <Group justify={'space-between'}>
            <SegmentedControl
              value={navigationAction}
              withItemsBorders={false}
              disabled={isInFlight}
              my={'xs'}
              onChange={(value) => setNavigationAction(value as NavigationActionState)}
              data={[
                {
                  value: NavigationActionState.Focus,
                  label: (
                    <>
                      <FocusIcon size={IconSize.sm} style={{ display: 'block' }} />
                      <VisuallyHidden>Set focus</VisuallyHidden>
                    </>
                  )
                },
                {
                  value: NavigationActionState.Anchor,
                  label: (
                    <>
                      <AnchorIcon size={IconSize.sm} style={{ display: 'block' }} />
                      <VisuallyHidden>Set anchor</VisuallyHidden>
                    </>
                  )
                },
                {
                  value: NavigationActionState.Aim,
                  label: (
                    <>
                      <TelescopeIcon size={IconSize.sm} style={{ display: 'block' }} />
                      <VisuallyHidden>Set aim</VisuallyHidden>
                    </>
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

        <FilterList heightFunc={computeHeight}>
          <FilterList.InputField
            placeHolderSearchText={searchPlaceholderText}
            showMoreButton
          />
          <FilterList.Favorites>
            {sortedDefaultList.map((entry) => (
              <FocusEntry
                key={entry.identifier}
                entry={entry}
                onSelect={onSelect}
                activeNode={activeNode}
                showNavigationButtons={isInFocusMode}
                disableFocus={isInFlight}
              />
            ))}
          </FilterList.Favorites>
          <FilterList.Data<PropertyOwner>
            data={sortedNodes}
            renderElement={(node) => (
              <FocusEntry
                key={node.identifier}
                entry={node}
                onSelect={onSelect}
                activeNode={activeNode}
                showNavigationButtons={isInFocusMode}
                disableFocus={isInFlight}
              />
            )}
            matcherFunc={generateMatcherFunctionByKeys([
              'identifier',
              'name',
              'uri',
              'tags'
            ])}
          />
        </FilterList>
      </Container>
    </ScrollArea>
  );
}
