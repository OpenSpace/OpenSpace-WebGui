import { Button, Divider, Group, Paper, Title } from '@mantine/core';

import { useGetStringPropertyValue, useOpenSpaceApi } from '@/api/hooks';
import { FilterList } from '@/components/FilterList/FilterList';
import { CancelIcon } from '@/icons/icons';
import { useAppSelector } from '@/redux/hooks';
import { EngineMode, IconSize } from '@/types/enums';
import { Identifier, PropertyOwner } from '@/types/types';
import { NavigationAimKey, NavigationAnchorKey } from '@/util/keys';
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

  const [anchor] = useGetStringPropertyValue(NavigationAnchorKey);
  const [aim] = useGetStringPropertyValue(NavigationAimKey);

  const luaApi = useOpenSpaceApi();

  const anchorNode = anchor ? propertyOwners[sgnUri(anchor)] : undefined;
  const isInFlight = engineMode === EngineMode.CameraPath;
  const hasAim = aim !== '' && aim !== anchor;

  function onSelect(
    identifier: Identifier,
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    const shouldRetarget = !event.shiftKey;
    const shouldResetVelocities = !event.ctrlKey;
    luaApi?.navigation.setFocus(identifier, shouldRetarget, shouldResetVelocities);
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
            isActive={!hasAim}
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
            isActive={!hasAim && anchor === entry.identifier}
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
            isActive={!hasAim && anchor === node.identifier}
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
