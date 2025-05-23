import { Trans, useTranslation } from 'react-i18next';
import {
  Button,
  Divider,
  Group,
  Kbd,
  List,
  Paper,
  Space,
  Text,
  Title
} from '@mantine/core';

import { useOpenSpaceApi } from '@/api/hooks';
import { FilterList } from '@/components/FilterList/FilterList';
import { InfoBox } from '@/components/InfoBox/InfoBox';
import { useProperty } from '@/hooks/properties';
import { useSubscribeToEngineMode } from '@/hooks/topicSubscriptions';
import { CancelIcon, FocusIcon } from '@/icons/icons';
import { EngineMode, IconSize } from '@/types/enums';
import { Identifier, PropertyOwner } from '@/types/types';
import { NavigationAimKey } from '@/util/keys';
import { useAnchorNode } from '@/util/propertyTreeHooks';

import { RemainingFlightTimeIndicator } from '../RemainingFlightTimeIndicator';

import { FocusEntry } from './FocusEntry';

interface Props {
  favorites: PropertyOwner[];
  searchableNodes: PropertyOwner[];
  matcherFunction: (node: PropertyOwner, query: string) => boolean;
  toggleKey: (key: keyof PropertyOwner, enabled: boolean) => void;
  allowedKeys: Partial<Record<keyof PropertyOwner, boolean>>;
}

export function FocusView({
  favorites,
  searchableNodes,
  matcherFunction,
  toggleKey,
  allowedKeys
}: Props) {
  const { t: tCommon } = useTranslation('common');
  const { t } = useTranslation('panel-navigation', {
    keyPrefix: 'anchor-aim.focus-view'
  });

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

  return (
    <FilterList>
      <Group justify={'space-between'}>
        <Title order={2}>{t('title')}</Title>
        <InfoBox w={300}>
          <Text>
            <Trans
              t={t}
              i18nKey={'info.click-focus-button'}
              components={{ focusIcon: <FocusIcon /> }}
            />
          </Text>
          <Space h={'xs'} />
          <List>
            <List.Item>
              <Trans
                t={t}
                i18nKey={'info.shift-keybind'}
                components={{ keybind: <Kbd /> }}
              />
            </List.Item>
            <List.Item>
              <Trans
                t={t}
                i18nKey={'info.ctrl-keybind'}
                components={{ keybind: <Kbd /> }}
              />
            </List.Item>
          </List>
        </InfoBox>
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
                {tCommon('cancel')}
              </Button>
            </Group>
          </Paper>
        )}
        <Divider />
      </>
      <Group gap={'xs'}>
        <FilterList.InputField
          placeHolderSearchText={t('filter-list-placeholder')}
          showMoreButton
          flex={'auto'}
        />
        <FilterList.SearchSettingsMenu keys={allowedKeys} setKey={toggleKey} />
      </Group>
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
