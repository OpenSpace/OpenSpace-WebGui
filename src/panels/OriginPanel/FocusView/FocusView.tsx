import { Button, Divider, Group, Kbd, Paper, Text, Title } from '@mantine/core';

import { useOpenSpaceApi } from '@/api/hooks';
import { FilterList } from '@/components/FilterList/FilterList';
import { InfoBox } from '@/components/InfoBox/InfoBox';
import { useSubscribeToEngineMode } from '@/hooks/topicSubscriptions';
import { CancelIcon, FocusIcon } from '@/icons/icons';
import { EngineMode, IconSize } from '@/types/enums';
import { Identifier, PropertyOwner } from '@/types/types';
import { NavigationAimKey } from '@/util/keys';
import { useAnchorNode } from '@/util/propertyTreeHooks';

import { RemainingFlightTimeIndicator } from '../RemainingFlightTimeIndicator';

import { FocusEntry } from './FocusEntry';
import { useProperty } from '@/hooks/properties';

interface Props {
  favorites: PropertyOwner[];
  searchableNodes: PropertyOwner[];
  matcherFunction: (node: PropertyOwner, query: string) => boolean;
}

export function FocusView({ favorites, searchableNodes, matcherFunction }: Props) {
  const engineMode = useSubscribeToEngineMode();

  const anchorNode = useAnchorNode();
  const [aim] = useProperty('StringProperty', NavigationAimKey);

  const luaApi = useOpenSpaceApi();

  const isInFlight = engineMode === EngineMode.CameraPath;
  const hasAim = aim !== '' && aim !== anchorNode?.identifier;

  function onSelect(
    identifier: Identifier,
    modifiers: { shiftKey: boolean; ctrlKey: boolean }
  ) {
    const shouldRetarget = !modifiers.shiftKey;
    const shouldResetVelocities = !modifiers.ctrlKey;
    luaApi?.navigation.setFocus(identifier, shouldRetarget, shouldResetVelocities);
  }

  const infoBoxContent = (
    <>
      <Text>
        Click the <FocusIcon /> button to focus/retarget object.
      </Text>
      <Text style={{ textWrap: 'pretty' }} mt={'xs'}>
        - Hold <Kbd>Shift</Kbd> when clicking to set as focus/anchor without retargetting.
      </Text>
      <Text style={{ textWrap: 'pretty' }}>
        - Hold <Kbd>Ctrl</Kbd> when clicking to keep current camera velocities.
      </Text>
    </>
  );

  return (
    <FilterList>
      <Group justify={'space-between'}>
        <Title order={2}>Focus</Title>
        <InfoBox w={300}>{infoBoxContent}</InfoBox>
      </Group>
      <>
        {anchorNode && !isInFlight && (
          <FocusEntry
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
            isActive={!hasAim && anchorNode?.identifier === entry.identifier}
            disableFocus={isInFlight}
            mb={3}
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
            isActive={!hasAim && anchorNode?.identifier === node.identifier}
            disableFocus={isInFlight}
          />
        )}
        matcherFunc={matcherFunction}
      >
        <FilterList.SearchResults.VirtualList gap={3} />
      </FilterList.SearchResults>
    </FilterList>
  );
}
