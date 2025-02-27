import { useState } from 'react';
import { Button, Text } from '@mantine/core';

import { FilterList } from '@/components/FilterList/FilterList';
import { generateMatcherFunctionByKeys } from '@/components/FilterList/util';
import { Layout } from '@/components/Layout/Layout';
import { useAppSelector } from '@/redux/hooks';
import { Action } from '@/types/types';

import { KeybindButtons } from './KeybindButtons';
import { KeybindInfo } from './KeybindInfo';

export function ListLayout() {
  const [selectedAction, setSelectedAction] = useState<Action | null>(null);
  const keybinds = useAppSelector((state) => state.actions.keybinds);
  const actions = useAppSelector((state) => state.actions.actions);

  const keybindInfo = keybinds
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

  return (
    <Layout>
      <Layout.GrowingSection pb={'md'}>
        <FilterList>
          <FilterList.InputField placeHolderSearchText={'Search for a keybind'} />
          <FilterList.SearchResults
            data={keybindInfo}
            renderElement={(node) => (
              <Button
                onClick={() => {
                  node.identifier === selectedAction?.identifier
                    ? setSelectedAction(null)
                    : setSelectedAction(node);
                }}
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
            matcherFunc={generateMatcherFunctionByKeys([
              'name',
              'key',
              'modifiers',
              'documentation'
            ])}
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
