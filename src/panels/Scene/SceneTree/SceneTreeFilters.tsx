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

import { SceneTreeFilterSettings } from './treeUtil';

interface Props {
  setFilter: (filter: SceneTreeFilterSettings) => void;
  filter: SceneTreeFilterSettings;
}

export function SceneTreeFilters({ setFilter, filter }: Props) {
  const tags = useAppSelector((state) => state.groups.tags);
  const { showOnlyVisible, showHiddenNodes, tags: selectedTags } = filter;

  const sortedTags = Array.from(tags).sort();
  const hasFilters = showOnlyVisible || showHiddenNodes || selectedTags.length > 0;

  function setSpecificFilter(
    filterKey: keyof SceneTreeFilterSettings,
    value: boolean | string[]
  ) {
    setFilter({ ...filter, [filterKey]: value });
  }

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
              checked={showOnlyVisible}
              onChange={(event) =>
                setSpecificFilter('showOnlyVisible', event.currentTarget.checked)
              }
            />
            <InfoBox text={'Visible = Enabled and not faded out'} />
          </Group>
          <Group>
            <Checkbox
              label={'Show objects with GUI hidden flag'}
              checked={showHiddenNodes}
              onChange={(event) =>
                setSpecificFilter('showHiddenNodes', event.currentTarget.checked)
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
            value={selectedTags}
            onChange={(newTags) => setSpecificFilter('tags', newTags)}
            clearable
            searchable
          />
        </Menu.Dropdown>
      </Menu>
    </Group>
  );
}
