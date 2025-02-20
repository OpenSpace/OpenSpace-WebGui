import { Button, Divider, Group, Paper, Title } from '@mantine/core';

import {
  useGetStringPropertyValue,
  useOpenSpaceApi,
  useTriggerProperty
} from '@/api/hooks';
import { FilterList } from '@/components/FilterList/FilterList';
import { CancelIcon } from '@/icons/icons';
import { useAppSelector } from '@/redux/hooks';
import { EngineMode, IconSize } from '@/types/enums';
import { Identifier, PropertyOwner } from '@/types/types';
import { NavigationAimKey, NavigationAnchorKey, RetargetAnchorKey } from '@/util/keys';
import { sgnUri } from '@/util/propertyTreeHelpers';

import { RemainingFlightTimeIndicator } from '../RemainingFlightTimeIndicator';

import { FocusEntry } from './FocusEntry';

interface Props {
  favorites: PropertyOwner[];
  searchableNodes: PropertyOwner[];
  heightFunction: (windowHeight: number) => number;
  matcherFunction: (node: PropertyOwner, query: string) => boolean;
}

export function FocusView({
  favorites,
  searchableNodes,
  heightFunction,
  matcherFunction
}: Props) {
  const propertyOwners = useAppSelector((state) => state.propertyOwners.propertyOwners);
  const engineMode = useAppSelector((state) => state.engineMode.mode);

  const [anchor, setAnchor] = useGetStringPropertyValue(NavigationAnchorKey);
  const [, setAim] = useGetStringPropertyValue(NavigationAimKey);
  const triggerRetargetAnchor = useTriggerProperty(RetargetAnchorKey);

  const luaApi = useOpenSpaceApi();

  const anchorNode = anchor ? propertyOwners[sgnUri(anchor)] : undefined;
  const isInFlight = engineMode === EngineMode.CameraPath;

  function onSelect(
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
    setAim('');

    if (!event.shiftKey) {
      triggerRetargetAnchor();
    }

    // TODO: Ctrl to not reset velocities
  }

  return (
    <FilterList heightFunc={heightFunction}>
      <Title order={2}>Focus</Title>
      <>
        {anchorNode && !isInFlight && (
          <FocusEntry
            key={anchor}
            entry={anchorNode}
            onSelect={onSelect}
            isActive={true}
            showFrameButton
            disableFocus={isInFlight}
          />
        )}
        {isInFlight && (
          <Paper py={'xs'}>
            <Group gap={'xs'} justify={'center'}>
              <RemainingFlightTimeIndicator compact={false} />
              <Button
                onClick={() => luaApi?.pathnavigation.stopPath()}
                leftSection={<CancelIcon size={IconSize.sm} />}
                variant={'light'}
                size={'sm'}
                color={'red'}
              >
                Cancel
              </Button>
            </Group>
          </Paper>
        )}
        <Divider />
      </>

      <FilterList.InputField
        placeHolderSearchText={'Search for a new focus...'}
        showMoreButton
      />
      <FilterList.Favorites>
        {favorites.map((entry) => (
          <FocusEntry
            key={entry.identifier}
            entry={entry}
            onSelect={onSelect}
            isActive={anchor === entry.identifier}
            disableFocus={isInFlight}
          />
        ))}
      </FilterList.Favorites>
      <FilterList.SearchResults
        data={searchableNodes}
        renderElement={(node) => (
          <FocusEntry
            key={node.identifier}
            entry={node}
            onSelect={onSelect}
            isActive={anchor === node.identifier}
            disableFocus={isInFlight}
          />
        )}
        matcherFunc={matcherFunction}
      >
        <FilterList.SearchResults.VirtualList />
      </FilterList.SearchResults>
    </FilterList>
  );
}
