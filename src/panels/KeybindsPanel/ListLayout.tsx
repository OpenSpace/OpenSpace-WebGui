import { useState } from 'react';
import { Button, Chip, Group, Text } from '@mantine/core';

import { FilterList } from '@/components/FilterList/FilterList';
import { generateMatcherFunctionByKeys } from '@/components/FilterList/util';
import { Layout } from '@/components/Layout/Layout';
import { useAppSelector } from '@/redux/hooks';
import { Action, KeybindModifiers } from '@/types/types';

import { KeybindButtons } from './KeybindButtons';
import { KeybindInfo } from './KeybindInfo';

export function ListLayout() {
  const [selectedAction, setSelectedAction] = useState<Action | null>(null);
  const [modifiersFilter, setModifiersFilter] = useState<KeybindModifiers>([]);
  const keybinds = useAppSelector((state) => state.actions.keybinds);
  const actions = useAppSelector((state) => state.actions.actions);

  const keybindInfo = keybinds
    .filter((keybind) => {
      // Filter all keybinds based on the modifiers selected
      return modifiersFilter.every((modifier) => keybind.modifiers.includes(modifier));
    })
    .map((keybind) => {
      const action = actions.find((action) => action.identifier === keybind.action);

      if (action === undefined) {
        return undefined;
      }

      return {
        ...keybind,
        ...action
      };
    })
    .filter((info) => !!info) // Filter any undefined objects
    .sort((a, b) => {
      return a.key > b.key ? 1 : -1;
    });

  function onClick(action: Action): void {
    if (action.identifier === selectedAction?.identifier) {
      setSelectedAction(null);
    } else {
      setSelectedAction(action);
    }
  }

  return (
    <Layout>
      <Layout.GrowingSection pb={'md'}>
        <FilterList>
          <Group gap={'xs'}>
            <FilterList.InputField
              placeHolderSearchText={'Search for a keybind'}
              flex={1}
              miw={150}
            />
            <Chip.Group
              multiple
              onChange={(value) => setModifiersFilter(value as KeybindModifiers)}
            >
              <Chip value={'shift'}>Shift</Chip>
              <Chip value={'control'}>Ctrl</Chip>
              <Chip value={'alt'}>Alt</Chip>
              <Chip value={'super'}>Super</Chip>
            </Chip.Group>
          </Group>
          <FilterList.SearchResults
            data={keybindInfo}
            renderElement={(node) => (
              <Button
                onClick={() => onClick(node)}
                size={'md'}
                variant={
                  node.identifier === selectedAction?.identifier ? 'filled' : 'light'
                }
                fullWidth
                rightSection={
                  <KeybindButtons modifiers={node.modifiers} selectedKey={node.key} />
                }
                justify={'space-between'}
              >
                <Text truncate>{node.name}</Text>
              </Button>
            )}
            matcherFunc={generateMatcherFunctionByKeys(['name', 'key', 'documentation'])}
          >
            <FilterList.SearchResults.VirtualList gap={'xs'} />
          </FilterList.SearchResults>
        </FilterList>
      </Layout.GrowingSection>
      <Layout.FixedSection>
        {selectedAction && <KeybindInfo selectedAction={selectedAction} />}
      </Layout.FixedSection>
    </Layout>
  );
}
