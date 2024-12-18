import { useState } from 'react';
import { ActionIcon, Container, Group } from '@mantine/core';

import { useGetStringPropertyValue, useSubscribeToProperty } from '@/api/hooks';
import { FilterList } from '@/components/FilterList/FilterList';
import { generateMatcherFunctionByKeys } from '@/components/FilterList/util';
import { AnchorIcon, FocusIcon, TelescopeIcon } from '@/icons/icons';
import { sendFlightControl } from '@/redux/flightcontroller/flightControllerMiddleware';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setPropertyValue } from '@/redux/propertytree/properties/propertiesSlice';
import { FlightControllerData } from '@/types/flightcontroller-types';
import { Identifier, PropertyOwner, Uri } from '@/types/types';
import {
  NavigationAimKey,
  NavigationAnchorKey,
  RetargetAimKey,
  RetargetAnchorKey
} from '@/util/keys';
import { hasInterestingTag } from '@/util/propertyTreeHelpers';

import { FocusEntry } from './FocusEntry';
import { OriginSettings } from './OriginSettings';

enum NavigationActionState {
  Focus = 'Focus',
  Anchor = 'Anchor',
  Aim = 'Aim'
}

export function OriginPanel() {
  // TODO (anden88 2024-10-17): in the old GUI the chosen navigation state is saved in
  // redux and restored between open & close, do we want the same here?
  const [navigationAction, setNavigationAction] = useState(NavigationActionState.Focus);

  const propertyOwners = useAppSelector((state) => state.propertyOwners.propertyOwners);
  const properties = useAppSelector((state) => state.properties.properties);
  const anchor = useGetStringPropertyValue(NavigationAnchorKey);
  const aim = useGetStringPropertyValue(NavigationAimKey);

  const dispatch = useAppDispatch();

  const setAnchorProperty = useSubscribeToProperty(NavigationAnchorKey);
  const setAimProperty = useSubscribeToProperty(NavigationAimKey);

  const uris: Uri[] = propertyOwners.Scene?.subowners ?? [];
  const allNodes = uris
    .map((uri) => propertyOwners[uri])
    .filter((po) => po !== undefined);

  const urisWithTags = uris.filter((uri) => hasInterestingTag(propertyOwners, uri));
  const favorites = urisWithTags
    .map(
      (uri) => propertyOwners[uri]
      // key: uri // TODO anden88 2024-10-21: do we really need to create a new object with key here or can we just use the propertyOwner interface and use the uri or identifier as its key?
    )
    .filter((po) => po !== undefined);

  // Searchable nodes are all nodes that are not hidden in the GUI
  const searchableNodes = allNodes.filter((node) => {
    const isHiddenProp = properties[`${node.uri}.GuiHidden`];
    const isHidden = isHiddenProp && isHiddenProp.value;
    return !isHidden;
  });
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

  // TODO find a better (?) way to color them depending on state
  function actionIconStyle(state: NavigationActionState) {
    return {
      backgroundColor:
        navigationAction === state ? 'var(--mantine-primary-color-filled)' : 'transparent'
    };
  }

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
          updateViewPayload.aim = anchor ? anchor : '';
        }
        updateViewPayload.anchor = identifier;
        break;
      case NavigationActionState.Aim:
        updateViewPayload.aim = identifier;
        updateViewPayload.anchor = anchor ? anchor : '';
        break;
      default:
        throw new Error(`Missing NavigationActionState case for: '${navigationAction}'`);
    }

    if (!event.shiftKey) {
      if (navigationAction === NavigationActionState.Aim) {
        dispatch(setPropertyValue({ uri: RetargetAimKey, value: null }));
      } else {
        dispatch(setPropertyValue({ uri: RetargetAnchorKey, value: null }));
      }
    }

    // TODO: these were null checks before but that is wierd
    const shouldRetargetAim = !event.shiftKey && updateViewPayload.aim !== '';
    const shouldRetargetAnchor = !event.shiftKey && updateViewPayload.aim === '';

    updateViewPayload.retargetAim = shouldRetargetAim;
    updateViewPayload.retargetAnchor = shouldRetargetAnchor;
    updateViewPayload.resetVelocities = !event.ctrlKey;

    dispatch(sendFlightControl(updateViewPayload));

    if (updateViewPayload.aim) {
      setAnchorProperty(updateViewPayload.anchor);
      setAimProperty(updateViewPayload.aim);
    } else if (updateViewPayload.anchor !== '') {
      setAnchorProperty(updateViewPayload.anchor);
    } else {
      setAnchorProperty(updateViewPayload.focus);
      setAimProperty(updateViewPayload.aim);
    }
  }

  return (
    // TODO anden88 2024-10-23: Not a huge fan of setting the flex styles on the container
    // like this, but this was the only way I could make the filterlist data take up the
    // remaining screenspace as an scrollable area without causing overflow issues and
    // without getting direct access to the RC-dock layout data
    // To expand on the problem, the ScrollArea.Autosize must set a max height at which
    // the scrollable is activated, perhaps its possible to get that height through a
    // ref to parent html object (?).
    <Container style={{ maxHeight: '100%', display: 'flex', flexDirection: 'column' }}>
      <Group justify={'space-between'}>
        <h2>Navigation</h2>
        <OriginSettings />
      </Group>
      <Group gap={0} mb={'xs'}>
        <ActionIcon
          onClick={() => setNavigationAction(NavigationActionState.Focus)}
          aria-label={'Select focus'}
          size={'lg'}
          style={actionIconStyle(NavigationActionState.Focus)}
        >
          <FocusIcon size={'70%'} />
        </ActionIcon>
        <ActionIcon
          onClick={() => setNavigationAction(NavigationActionState.Anchor)}
          aria-label={'Select anchor'}
          size={'lg'}
          style={actionIconStyle(NavigationActionState.Anchor)}
        >
          <AnchorIcon size={'70%'} />
        </ActionIcon>
        <ActionIcon
          onClick={() => setNavigationAction(NavigationActionState.Aim)}
          aria-label={'Select aim'}
          size={'lg'}
          style={actionIconStyle(NavigationActionState.Aim)}
        >
          <TelescopeIcon size={'70%'} />
        </ActionIcon>
      </Group>
      <FilterList placeHolderSearchText={searchPlaceholderText} showMoreButton>
        <FilterList.Favorites>
          {sortedDefaultList.map((entry) => (
            <FocusEntry
              key={entry.identifier}
              entry={entry}
              onSelect={onSelect}
              activeNode={activeNode}
              showNavigationButtons={isInFocusMode}
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
  );
}
