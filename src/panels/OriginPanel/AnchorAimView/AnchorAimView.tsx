import { Button, Divider, Group, Kbd, Space, Text, Title, Tooltip } from '@mantine/core';

import {
  useGetStringPropertyValue,
  useSubscribeToEngineMode,
  useTriggerProperty
} from '@/api/hooks';
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

import { AnchorAimListEntry } from './AnchorAimListEntry';

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
  const engineMode = useSubscribeToEngineMode();

  const [anchor, setAnchor] = useGetStringPropertyValue(NavigationAnchorKey);
  const [aim, setAim] = useGetStringPropertyValue(NavigationAimKey);
  const triggerRetargetAnchor = useTriggerProperty(RetargetAnchorKey);
  const triggerRetargetAim = useTriggerProperty(RetargetAimKey);

  const anchorNode = anchor ? propertyOwners[sgnUri(anchor)] : undefined;
  const aimNode = aim ? propertyOwners[sgnUri(aim)] : undefined;
  const isInFlight = engineMode === EngineMode.CameraPath;

  if (anchor === undefined || aim === undefined) {
    throw new Error('Anchor or aim property property does not exist');
  }

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
            onClick={(event) => onSelectAnchor(anchor, event)}
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
            onClick={(event) => onSelectAim(aim, event)}
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
        {favorites.map((entry) => (
          <AnchorAimListEntry
            key={entry.identifier}
            node={entry}
            isCurrentAim={aim === entry.identifier}
            isCurrentAnchor={anchor === entry.identifier}
            onSelectAnchor={onSelectAnchor}
            onSelectAim={onSelectAim}
            disabled={isInFlight}
          />
        ))}
      </FilterList.Favorites>
      <FilterList.SearchResults
        data={searchableNodes}
        renderElement={(node) => (
          <AnchorAimListEntry
            key={node.identifier}
            node={node}
            isCurrentAim={aim === node.identifier}
            isCurrentAnchor={anchor === node.identifier}
            onSelectAnchor={onSelectAnchor}
            onSelectAim={onSelectAim}
            disabled={isInFlight}
          />
        )}
        matcherFunc={matcherFunction}
      >
        <FilterList.SearchResults.VirtualList />
      </FilterList.SearchResults>
    </FilterList>
  );
}
