import { Button, Center, Divider, Group, Paper, Title } from '@mantine/core';

import {
  useGetStringPropertyValue,
  useOpenSpaceApi,
  useTriggerProperty
} from '@/api/hooks';
import { FilterList } from '@/components/FilterList/FilterList';
import { AirplaneCancelIcon } from '@/icons/icons';
import { useAppSelector } from '@/redux/hooks';
import { EngineMode, IconSize } from '@/types/enums';
import { Identifier, PropertyOwner } from '@/types/types';
import { NavigationAimKey, NavigationAnchorKey, RetargetAnchorKey } from '@/util/keys';
import { sgnUri } from '@/util/propertyTreeHelpers';

import { FocusEntry } from './FocusEntry';
import { RemainingFlightTimeIndicator } from './RemainingFlightTimeIndicator';

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
            activeNode={anchor}
            showNavigationButtons={true} // TODO remove option
            showFrameButton
            disableFocus={isInFlight}
          />
        )}
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
            activeNode={anchor}
            showNavigationButtons={true} // TODO remove option
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
            activeNode={anchor}
            showNavigationButtons={true} // TODO remove option
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
