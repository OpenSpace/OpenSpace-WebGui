import { Button, Divider, Group, Kbd, Paper, Space, Text, Title } from '@mantine/core';

import {
  useGetStringPropertyValue,
  useOpenSpaceApi,
  useSubscribeToEngineMode
} from '@/api/hooks';
import { FilterList } from '@/components/FilterList/FilterList';
import { InfoBox } from '@/components/InfoBox/InfoBox';
import { CancelIcon, FocusIcon } from '@/icons/icons';
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
  matcherFunction: (node: PropertyOwner, query: string) => boolean;
}

export function FocusView({ favorites, searchableNodes, matcherFunction }: Props) {
  const propertyOwners = useAppSelector((state) => state.propertyOwners.propertyOwners);
  const engineMode = useSubscribeToEngineMode();

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

  const infoBoxContent = (
    <>
      <Text>
        Click the <FocusIcon /> button to focus/retarget object.
      </Text>
      <Space h={'xs'} />
      <Text style={{ textWrap: 'pretty' }}>
        - Hold <Kbd>Shift</Kbd> on-click to set as focus/anchor without retargetting.
      </Text>
      <Text style={{ textWrap: 'pretty' }}>
        - Hold <Kbd>Ctrl</Kbd> on-click to keep current camera velocities.
      </Text>
    </>
  );

  return (
    <FilterList>
      <Group justify={'space-between'}>
        <Title order={2}>Focus</Title>
        <InfoBox text={infoBoxContent} w={300} />
      </Group>
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
