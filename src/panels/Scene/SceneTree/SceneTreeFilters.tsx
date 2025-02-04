import { useEffect, useState } from 'react';
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
  onFilterChange: (filter: SceneTreeFilterSettings) => void;
}

export function SceneTreeFilters({ onFilterChange }: Props) {
  const [showOnlyVisible, setshowOnlyVisible] = useState(false);
  const [showHiddenNodes, setShowHiddenNodes] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const tags = useAppSelector((state) => state.groups.tags);

  const sortedTags = Array.from(tags).sort();
  const hasFilters = showOnlyVisible || showHiddenNodes || selectedTags.length > 0;

  // Trigger callback when the filter changes
  useEffect(() => {
    onFilterChange({
      showOnlyVisible,
      showHiddenNodes,
      tags: selectedTags
    });
  }, [onFilterChange, selectedTags, showHiddenNodes, showOnlyVisible]);

  function clearFilters() {
    setshowOnlyVisible(false);
    setShowHiddenNodes(false);
    setSelectedTags([]);
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
              onChange={(event) => setshowOnlyVisible(event.currentTarget.checked)}
            />
            <InfoBox text={'Visible = Enabled and not faded out'} />
          </Group>
          <Group>
            <Checkbox
              label={'Show objects with GUI hidden flag'}
              checked={showHiddenNodes}
              onChange={(event) => setShowHiddenNodes(event.currentTarget.checked)}
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
            onChange={setSelectedTags}
            clearable
            searchable
          />
        </Menu.Dropdown>
      </Menu>
    </Group>
  );
}
