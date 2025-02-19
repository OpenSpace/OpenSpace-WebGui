import { ActionIcon, Button, Divider, Group, Text, Title } from '@mantine/core';

import { useGetStringPropertyValue, useTriggerProperty } from '@/api/hooks';
import { FilterList } from '@/components/FilterList/FilterList';
import { AnchorIcon, TelescopeIcon } from '@/icons/icons';
import { useAppSelector } from '@/redux/hooks';
import { EngineMode, IconSize } from '@/types/enums';
import { Identifier, PropertyOwner } from '@/types/types';
import {
  NavigationAimKey,
  NavigationAnchorKey,
  RetargetAimKey,
  RetargetAnchorKey
} from '@/util/keys';
import { sgnUri } from '@/util/propertyTreeHelpers';

interface Props {
  favorites: PropertyOwner[];
  searchableNodes: PropertyOwner[];
  heightFunction: (windowHeight: number) => number;
  matcherFunction: (node: PropertyOwner, query: string) => boolean;
}

export function AnchorAimView({
  favorites,
  searchableNodes,
  heightFunction,
  matcherFunction
}: Props) {
  const propertyOwners = useAppSelector((state) => state.propertyOwners.propertyOwners);
  const engineMode = useAppSelector((state) => state.engineMode.mode);

  const [anchor, setAnchor] = useGetStringPropertyValue(NavigationAnchorKey);
  const [aim, setAim] = useGetStringPropertyValue(NavigationAimKey);
  const triggerRetargetAnchor = useTriggerProperty(RetargetAnchorKey);
  const triggerRetargetAim = useTriggerProperty(RetargetAimKey);

  const anchorNode = anchor ? propertyOwners[sgnUri(anchor)] : undefined;
  const aimNode = aim ? propertyOwners[sgnUri(aim)] : undefined;
  const isInFlight = engineMode === EngineMode.CameraPath;

  function onSelectAnchor(
    identifier: Identifier,
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    // const updateViewPayload: FlightControllerData = {
    //   type: 'updateView',
    //   focus: '',
    //   aim: '',
    //   anchor: '',
    //   resetVelocities: false,
    //   retargetAnchor: false,
    //   retargetAim: false
    // };

    // updateViewPayload.focus = identifier;
    // updateViewPayload.aim = '';
    // updateViewPayload.anchor = '';

    setAnchor(identifier);

    if (!event.shiftKey) {
      triggerRetargetAnchor();
    }

    // TODO: Ctrl to not reset velocities
  }

  function onSelectAim(
    identifier: Identifier,
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    // const updateViewPayload: FlightControllerData = {
    //   type: 'updateView',
    //   focus: '',
    //   aim: '',
    //   anchor: '',
    //   resetVelocities: false,
    //   retargetAnchor: false,
    //   retargetAim: false
    // };

    // updateViewPayload.focus = identifier;
    // updateViewPayload.aim = '';
    // updateViewPayload.anchor = '';

    setAim(identifier);

    if (!event.shiftKey) {
      triggerRetargetAim();
    }

    // TODO: Ctrl to not reset velocities
  }

  function listEntry(node: PropertyOwner) {
    return (
      <Group gap={'xs'} key={node.identifier}>
        <Text flex={1} truncate pl={'xs'}>
          {node.name}
        </Text>
        <ActionIcon
          aria-label={'Set anchor'}
          size={'lg'}
          variant={node.identifier === anchor ? 'filled' : 'light'}
          onClick={(event) => onSelectAnchor(node.identifier, event)}
          disabled={isInFlight}
        >
          <AnchorIcon />
        </ActionIcon>
        <ActionIcon
          aria-label={'Set aim'}
          size={'lg'}
          variant={node.identifier === aim ? 'filled' : 'light'}
          onClick={(event) => onSelectAim(node.identifier, event)}
          disabled={isInFlight}
        >
          <TelescopeIcon />
        </ActionIcon>
      </Group>
    );
  }

  return (
    <FilterList heightFunc={heightFunction}>
      <Title order={2}>Anchor / Aim</Title>
      <Group gap={'xs'}>
        <Button
          flex={1}
          leftSection={<AnchorIcon size={IconSize.sm} />}
          variant={'filled'}
          onClick={(event) => onSelectAnchor(anchor!, event)}
          disabled={isInFlight}
          miw={100}
        >
          <Text truncate>{anchorNode?.name}</Text>
        </Button>
        <Button
          flex={1}
          variant={'filled'}
          leftSection={<TelescopeIcon size={IconSize.sm} />}
          onClick={(event) => onSelectAim(aim!, event)}
          disabled={isInFlight || !aimNode}
          miw={100}
        >
          {aimNode ? (
            <Text truncate>{aimNode.name}</Text>
          ) : (
            <Text c={'dimmed'}>No aim</Text>
          )}
        </Button>
      </Group>
      <Divider />

      <FilterList.InputField
        placeHolderSearchText={'Search for a new anchor/aim...'}
        showMoreButton
      />
      <FilterList.Favorites>
        {favorites.map((entry) => listEntry(entry))}
      </FilterList.Favorites>
      <FilterList.SearchResults
        data={searchableNodes}
        renderElement={(node) => listEntry(node)}
        matcherFunc={matcherFunction}
      >
        <FilterList.SearchResults.VirtualList />
      </FilterList.SearchResults>
    </FilterList>
  );
}
