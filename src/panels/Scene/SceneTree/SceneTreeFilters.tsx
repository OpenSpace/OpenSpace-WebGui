import { useTranslation } from 'react-i18next';
import {
  ActionIcon,
  Button,
  Group,
  Menu,
  MultiSelect,
  Stack,
  Tooltip
} from '@mantine/core';

import { BoolInput } from '@/components/Input/BoolInput';
import { hasActiveFilters } from '@/hooks/sceneGraphNodes/util';
import { FilterIcon } from '@/icons/icons';
import { useAppSelector } from '@/redux/hooks';

import { sceneTreeFilterDefaults, SceneTreeFilterSettings } from './types';

interface Props {
  setFilter: (
    statePartial:
      | Partial<SceneTreeFilterSettings>
      | ((currentState: SceneTreeFilterSettings) => Partial<SceneTreeFilterSettings>)
  ) => void;
  filter: SceneTreeFilterSettings;
}

export function SceneTreeFilters({ setFilter, filter }: Props) {
  const { t } = useTranslation('panel-scene', {
    keyPrefix: 'scene-tree.scene-tree-filters'
  });

  const tags = useAppSelector((state) => state.groups.tags);

  const sortedTags = Array.from(tags).sort();
  const hasFilters = hasActiveFilters({ ...filter }) || filter.showOnlyVisible;

  function clearFilters() {
    setFilter(sceneTreeFilterDefaults);
  }

  return (
    <Group>
      {hasFilters && (
        <Button size={'compact-sm'} onClick={clearFilters}>
          {t('reset-filters')}
        </Button>
      )}
      <Menu position={'right-start'} withArrow closeOnItemClick={false}>
        <Menu.Target>
          <Tooltip label={t('settings-tooltip')}>
            <ActionIcon aria-label={t('settings-aria-label')}>
              <FilterIcon />
            </ActionIcon>
          </Tooltip>
        </Menu.Target>
        <Menu.Dropdown maw={'330px'}>
          <Menu.Label>{t('menu-label-filters')}</Menu.Label>
          <Stack px={'xs'} gap={'xs'}>
            <BoolInput
              label={t('show-only-visible.label')}
              value={filter.showOnlyVisible}
              onChange={(value) => setFilter({ showOnlyVisible: value })}
              info={t('show-only-visible.info')}
            />
            <BoolInput
              label={t('show-only-focusable.label')}
              value={filter.onlyFocusable || false}
              onChange={(value) => setFilter({ onlyFocusable: value })}
              info={t('show-only-focusable.info')}
            />
            <BoolInput
              label={t('show-gui-hidden.label')}
              value={filter.includeGuiHiddenNodes || false}
              onChange={(value) => setFilter({ includeGuiHiddenNodes: value })}
              info={t('show-gui-hidden.info')}
            />
          </Stack>
          <Menu.Label>{t('menu-label-tags')}</Menu.Label>
          <MultiSelect
            data={sortedTags}
            value={filter.tags}
            onChange={(newTags) => setFilter({ tags: newTags })}
            clearable
            searchable
            px={'xs'}
          />
        </Menu.Dropdown>
      </Menu>
    </Group>
  );
}
