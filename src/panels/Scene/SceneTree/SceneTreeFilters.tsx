import {
  ActionIcon,
  Button,
  Group,
  Menu,
  MultiSelect,
  Stack,
  Title,
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
          Reset filters
        </Button>
      )}
      <Menu position={'right-start'} withArrow closeOnItemClick={false}>
        <Menu.Target>
          <Tooltip label={'Additional settings to filter search result'}>
            <ActionIcon aria-label={'Open search filter menu'}>
              <FilterIcon />
            </ActionIcon>
          </Tooltip>
        </Menu.Target>
        <Menu.Dropdown maw={'330px'}>
          <Menu.Label>Filters</Menu.Label>
          <Stack px={'xs'} gap={'xs'}>
            <BoolInput
              label={'Show only visible'}
              value={filter.showOnlyVisible}
              setValue={(value) => setFilter({ showOnlyVisible: value })}
              info={`Show only nodes that are currenlty visible, meaning enabled and not
                faded out.`}
            />
            <BoolInput
              label={'Show only focusable'}
              value={filter.onlyFocusable || false}
              setValue={(value) => setFilter({ onlyFocusable: value })}
              info={`Hide scene graph nodes that are not markes as focusable, meaning that
                they cannot be directly set as the focus node in the scene.`}
            />
            <BoolInput
              label={'Show objects with GUI hidden flag'}
              value={filter.includeGuiHiddenNodes || false}
              setValue={(value) => setFilter({ includeGuiHiddenNodes: value })}
              info={`Show scene graph nodes that are marked as hidden in the GUI part of
                the asset. These are otherwise hidden in the interface.`}
            />
            <Title order={3}>Tags</Title>
            <MultiSelect
              data={sortedTags}
              value={filter.tags}
              onChange={(newTags) => setFilter({ tags: newTags })}
              clearable
              searchable
            />
          </Stack>
        </Menu.Dropdown>
      </Menu>
    </Group>
  );
}
