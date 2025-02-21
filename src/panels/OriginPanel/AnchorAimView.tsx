import {
  ActionIcon,
  Button,
  Divider,
  Group,
  Kbd,
  Space,
  Text,
  Title,
  Tooltip
} from '@mantine/core';

import { useGetStringPropertyValue, useTriggerProperty } from '@/api/hooks';
import { FilterList } from '@/components/FilterList/FilterList';
import { InfoBox } from '@/components/InfoBox/InfoBox';
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
    setAnchor(identifier);

    if (!event.shiftKey) {
      triggerRetargetAnchor();
    }
  }

  function onSelectAim(
    identifier: Identifier,
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    setAim(identifier);

    if (!event.shiftKey) {
      triggerRetargetAim();
    }
  }

  function listEntry(node: PropertyOwner) {
    return (
      <Group gap={'xs'} key={node.identifier}>
        <Text flex={1} truncate pl={'xs'}>
          {node.name}
        </Text>
        <Tooltip label={'Set and target anchor'} openDelay={600}>
          <ActionIcon
            aria-label={'Set anchor'}
            size={'lg'}
            variant={node.identifier === anchor ? 'filled' : 'light'}
            onClick={(event) => onSelectAnchor(node.identifier, event)}
            disabled={isInFlight}
          >
            <AnchorIcon />
          </ActionIcon>
        </Tooltip>
        <Tooltip label={'Set and target aim'} openDelay={600}>
          <ActionIcon
            aria-label={'Set aim'}
            size={'lg'}
            variant={node.identifier === aim ? 'filled' : 'light'}
            onClick={(event) => onSelectAim(node.identifier, event)}
            disabled={isInFlight}
          >
            <TelescopeIcon />
          </ActionIcon>
        </Tooltip>
      </Group>
    );
  }

  const infoBoxContent = (
    <>
      <Text style={{ textWrap: 'pretty' }}>
        Set an anchor (<AnchorIcon />) that the camera attaches to, and an aim (
        <TelescopeIcon />) for the camera to look at. The aim will be kept in the same
        position as time changes.
      </Text>
      <Space h={'xs'} />
      <Text style={{ textWrap: 'pretty' }}>
        When selecting the aim/anchor, the chosen node will be targetted to be centered in
        the view. Hold <Kbd>Shift</Kbd> on-click to set anchor/aim without targetting.
      </Text>
    </>
  );

  return (
    <FilterList heightFunc={heightFunction}>
      <Group justify={'space-between'}>
        <Title order={2}>Anchor / Aim</Title>
        <InfoBox text={infoBoxContent} w={300} />
      </Group>
      <Group gap={'xs'}>
        <Tooltip label={'Retarget anchor'} openDelay={600}>
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
        </Tooltip>

        <Tooltip label={aimNode ? 'Retarget aim' : 'No aim is set'} openDelay={600}>
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
        </Tooltip>
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
