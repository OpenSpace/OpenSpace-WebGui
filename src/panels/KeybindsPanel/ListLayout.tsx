import { useState } from 'react';
import { Box, Chip, Group, Paper, Text } from '@mantine/core';

import { FilterList } from '@/components/FilterList/FilterList';
import { useSearchKeySettings } from '@/components/FilterList/SearchSettingsMenu/hook';
import { generateMatcherFunctionByKeys } from '@/components/FilterList/util';
import { Layout } from '@/components/Layout/Layout';
import { useAppSelector } from '@/redux/hooks';
import { Action, KeybindInfoType, KeybindModifiers } from '@/types/types';

import { KeybindInfo } from './KeybindInfo';
import { KeybindListEntry } from './ListEntry';

export function ListLayout() {
  const [selectedAction, setSelectedAction] = useState<Action | null>(null);
  const [modifiersFilter, setModifiersFilter] = useState<KeybindModifiers>([]);
  const keybinds = useAppSelector((state) => state.actions.keybinds);
  const actions = useAppSelector((state) => state.actions.actions);

  const { allowedSearchKeys, toggleSearchKey, selectedSearchKeys } =
    useSearchKeySettings<KeybindInfoType>({
      name: true,
      documentation: false,
      key: true
    });

  const keybindInfo: KeybindInfoType[] = keybinds
    .filter((keybind) => {
      // Filter all keybinds based on the modifiers selected
      return modifiersFilter.every((modifier) => keybind.modifiers.includes(modifier));
    })
    .map((keybind) => {
      const action = actions.find((action) => action.identifier === keybind.action);

      if (!action) {
        return undefined;
      }
      // Combine the keybind and action data to one object
      return {
        ...keybind,
        ...action
      };
    })
    .filter((info) => !!info) // Filter any undefined objects
    .sort((a, b) => (a.key > b.key ? 1 : -1));

  function onClick(action: Action): void {
    if (action.identifier === selectedAction?.identifier) {
      setSelectedAction(null);
    } else {
      setSelectedAction(action);
    }
  }

  return (
    <Group align={'top'} px={'xs'} h={'100%'}>
      <Layout pt={'xs'} flex={2}>
        <FilterList>
          <Layout.FixedSection>
            <Group gap={'xs'}>
              <FilterList.InputField
                placeHolderSearchText={'Search for a keybind'}
                flex={1}
                miw={200}
              />
              <Group gap={5}>
                <Chip.Group
                  multiple
                  onChange={(value) => setModifiersFilter(value as KeybindModifiers)}
                >
                  <Chip value={'shift'} size={'xs'}>
                    Shift
                  </Chip>
                  <Chip value={'control'} size={'xs'}>
                    Ctrl
                  </Chip>
                  <Chip value={'alt'} size={'xs'}>
                    Alt
                  </Chip>
                </Chip.Group>
              </Group>
              <FilterList.SearchSettingsMenu
                keys={allowedSearchKeys}
                setKey={toggleSearchKey}
              />
            </Group>
          </Layout.FixedSection>

          <Layout.GrowingSection>
            <FilterList.SearchResults
              data={keybindInfo}
              renderElement={(entry) => (
                <KeybindListEntry
                  key={entry.identifier}
                  keybind={entry}
                  onClick={() => onClick(entry)}
                  isSelected={entry.identifier === selectedAction?.identifier}
                />
              )}
              matcherFunc={generateMatcherFunctionByKeys(selectedSearchKeys)}
            >
              <FilterList.SearchResults.VirtualList gap={'xs'} />
            </FilterList.SearchResults>
          </Layout.GrowingSection>
        </FilterList>
      </Layout>
      <Box flex={1} pt={'xs'}>
        {selectedAction ? (
          <KeybindInfo action={selectedAction} />
        ) : (
          <Paper p={'md'}>
            <Text>Select a keybind to see more info</Text>
          </Paper>
        )}
      </Box>
    </Group>
  );
}
