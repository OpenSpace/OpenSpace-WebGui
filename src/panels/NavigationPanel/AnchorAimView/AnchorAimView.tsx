import { Trans, useTranslation } from 'react-i18next';
import { Button, Divider, Group, Kbd, Space, Text, Title, Tooltip } from '@mantine/core';

import { FilterList } from '@/components/FilterList/FilterList';
import { InfoBox } from '@/components/InfoBox/InfoBox';
import { TruncatedText } from '@/components/TruncatedText/TruncatedText';
import { useProperty } from '@/hooks/properties';
import { useSubscribeToEngineMode } from '@/hooks/topicSubscriptions';
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
  matcherFunction: (node: PropertyOwner, query: string) => boolean;
  toggleKey: (key: keyof PropertyOwner, enabled: boolean) => void;
  allowedKeys: Partial<Record<keyof PropertyOwner, boolean>>;
}

export function AnchorAimView({
  favorites,
  searchableNodes,
  matcherFunction,
  toggleKey,
  allowedKeys
}: Props) {
  const propertyOwners = useAppSelector((state) => state.propertyOwners.propertyOwners);
  const engineMode = useSubscribeToEngineMode();
  const { t } = useTranslation('panel-navigation', {
    keyPrefix: 'anchor-aim.anchor-aim-view'
  });

  const [anchor, setAnchor] = useProperty('StringProperty', NavigationAnchorKey);
  const [aim, setAim] = useProperty('StringProperty', NavigationAimKey);
  const [, triggerRetargetAnchor] = useProperty('TriggerProperty', RetargetAnchorKey);
  const [, triggerRetargetAim] = useProperty('TriggerProperty', RetargetAimKey);

  const anchorNode = anchor ? propertyOwners[sgnUri(anchor)] : undefined;
  const aimNode = aim ? propertyOwners[sgnUri(aim)] : undefined;
  const isInFlight = engineMode === EngineMode.CameraPath;

  if (anchor === undefined || aim === undefined) {
    throw new Error(t('error.no-anchor-aim-property'));
  }

  function onSelectAnchor(
    identifier: Identifier,
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    setAnchor(identifier);

    if (!event.shiftKey) {
      triggerRetargetAnchor(null);
    }
  }

  function onSelectAim(
    identifier: Identifier,
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    setAim(identifier);

    if (!event.shiftKey) {
      triggerRetargetAim(null);
    }
  }

  return (
    <FilterList>
      <Group>
        <Title order={2}>{t('title')}</Title>
        <InfoBox w={300}>
          <Text style={{ textWrap: 'pretty' }}>
            <Trans
              t={t}
              i18nKey={'info.about-icons'}
              components={{
                anchorIcon: <AnchorIcon />,
                aimIcon: <TelescopeIcon />
              }}
            />
          </Text>
          <Space h={'xs'} />
          <Text style={{ textWrap: 'pretty' }}>
            <Trans
              t={t}
              i18nKey={'info.shift-keybind'}
              components={{ keybind: <Kbd /> }}
            />
          </Text>
        </InfoBox>
      </Group>

      <Group gap={'xs'}>
        <Tooltip label={t('retarget-anchor-tooltip')} openDelay={600}>
          <Button
            flex={1}
            leftSection={<AnchorIcon size={IconSize.sm} />}
            variant={'filled'}
            onClick={(event) => onSelectAnchor(anchor, event)}
            disabled={isInFlight}
            miw={100}
          >
            <TruncatedText>{anchorNode?.name}</TruncatedText>
          </Button>
        </Tooltip>

        <Tooltip
          label={aimNode ? t('retarget-aim-tooltip') : t('retarget-aim-tooltip-no-aim')}
          openDelay={600}
        >
          <Button
            flex={1}
            variant={'filled'}
            leftSection={<TelescopeIcon size={IconSize.sm} />}
            onClick={(event) => onSelectAim(aim, event)}
            disabled={isInFlight || !aimNode}
            miw={100}
          >
            {aimNode ? (
              <TruncatedText>{aimNode.name}</TruncatedText>
            ) : (
              <Text c={'dimmed'}>{t('no-aim')}</Text>
            )}
          </Button>
        </Tooltip>
      </Group>
      <Divider />
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
          <AnchorAimListEntry
            key={entry.identifier}
            node={entry}
            isCurrentAim={aim === entry.identifier}
            isCurrentAnchor={anchor === entry.identifier}
            onSelectAnchor={onSelectAnchor}
            onSelectAim={onSelectAim}
            disabled={isInFlight}
            mb={3}
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
        <FilterList.SearchResults.VirtualList gap={3} />
      </FilterList.SearchResults>
    </FilterList>
  );
}
