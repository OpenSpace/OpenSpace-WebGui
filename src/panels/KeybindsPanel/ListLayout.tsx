import { useState } from 'react';
import { Chip, Container, Group } from '@mantine/core';

import { FilterList } from '@/components/FilterList/FilterList';
import { useSearchKeySettings } from '@/components/FilterList/SearchSettingsMenu/hook';
import { generateMatcherFunctionByKeys } from '@/components/FilterList/util';
import { Layout } from '@/components/Layout/Layout';
import { useAppSelector } from '@/redux/hooks';
import { Action, KeybindInfoType, KeybindModifiers } from '@/types/types';

import { KeybindInfo } from './KeybindInfo';
import { ListEntry } from './ListEntry';

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
    <Container>
      <Layout pb={'xs'}>
        <Layout.GrowingSection py={'md'}>
          <FilterList>
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
            <FilterList.SearchResults
              data={keybindInfo}
              renderElement={(entry) => (
                <ListEntry
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
          </FilterList>
        </Layout.GrowingSection>
        <Layout.FixedSection>
          {selectedAction && <KeybindInfo selectedAction={selectedAction} />}
        </Layout.FixedSection>
      </Layout>
    </Container>
  );
}
