import {
  ActionIcon,
  Button,
  Checkbox,
  Group,
  Menu,
  MultiSelect,
  Title
} from '@mantine/core';

import { InfoBox } from '@/components/InfoBox/InfoBox';
import { FilterIcon } from '@/icons/icons';
import { useAppSelector } from '@/redux/hooks';

import { SceneTreeFilterSettings } from './types';

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
  const hasFilters =
    filter.showOnlyVisible || filter.showHiddenNodes || filter.tags.length > 0;

  function clearFilters() {
    setFilter({ showOnlyVisible: false, showHiddenNodes: false, tags: [] });
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
          <ActionIcon>
            <FilterIcon />
          </ActionIcon>
        </Menu.Target>
        <Menu.Dropdown maw={'300px'}>
          <Group>
            <Checkbox
              label={'Show only visible'}
              checked={filter.showOnlyVisible}
              onChange={(event) =>
                setFilter({ showOnlyVisible: event.currentTarget.checked })
              }
            />
            <InfoBox text={'Visible = Enabled and not faded out'} />
          </Group>
          <Group>
            <Checkbox
              label={'Show objects with GUI hidden flag'}
              checked={filter.showHiddenNodes}
              onChange={(event) =>
                setFilter({ showHiddenNodes: event.currentTarget.checked })
              }
            />
            <InfoBox
              text={
                'Show scene graph nodes that are marked as hidden in the GUI ' +
                'part of the asset. These are otherwise hidden in the interface'
              }
            />
          </Group>
          <Title order={3}>Tags</Title>
          <MultiSelect
            data={sortedTags}
            value={filter.tags}
            onChange={(newTags) => setFilter({ tags: newTags })}
            clearable
            searchable
          />
        </Menu.Dropdown>
      </Menu>
    </Group>
  );
}
