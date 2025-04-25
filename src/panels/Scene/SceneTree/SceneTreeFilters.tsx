import {
  ActionIcon,
  Button,
  Checkbox,
  Group,
  Menu,
  MultiSelect,
  Stack,
  Title,
  Tooltip
} from '@mantine/core';

import { InfoBox } from '@/components/InfoBox/InfoBox';
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
          <Stack p={'xs'}>
            <Group>
              <Checkbox
                label={'Show only visible'}
                checked={filter.showOnlyVisible}
                onChange={(event) =>
                  setFilter({ showOnlyVisible: event.currentTarget.checked })
                }
              />
              <InfoBox>Visible = Enabled and not faded out</InfoBox>
            </Group>
            <Group>
              <Checkbox
                label={'Show only focusable'}
                checked={filter.onlyFocusable}
                onChange={(event) =>
                  setFilter({ onlyFocusable: event.currentTarget.checked })
                }
              />
              <InfoBox>
                Hide scene graph nodes that are not markes as focusable, meaning that they
                cannot be directly set as the focus node in the scene.
              </InfoBox>
            </Group>
            <Group>
              <Checkbox
                label={'Show objects with GUI hidden flag'}
                checked={filter.includeGuiHiddenNodes}
                onChange={(event) =>
                  setFilter({ includeGuiHiddenNodes: event.currentTarget.checked })
                }
              />
              <InfoBox>
                Show scene graph nodes that are marked as hidden in the GUI part of the
                asset. These are otherwise hidden in the interface.
              </InfoBox>
            </Group>
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
