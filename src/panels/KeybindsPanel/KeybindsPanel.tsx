import React from 'react';
import { Container, Group, Kbd, Stack,Text, Title } from '@mantine/core';

import { FilterList } from '@/components/FilterList/FilterList';
import { generateMatcherFunctionByKeys } from '@/components/FilterList/util';
import { useAppSelector } from '@/redux/hooks';
import { Action, Keybind as KeybindType } from '@/types/types';

import { KeyboardComponent } from './Keyboard/Keyboard';
import { Keybind } from './Keybind';

export function KeyBindsPanel() {
  const [selectedActions, setSelectedActions] = React.useState<Action[]>([]);
  const [activeModifiers, setActiveModifiers] = React.useState<string[]>([]);
  const [selectedKey, setSelectedKey] = React.useState<string>('');

  return (
    <>
      <KeyboardComponent
        setSelectedActions={setSelectedActions}
        setActiveModifiers={setActiveModifiers}
        setSelectedKey={setSelectedKey}
        selectedKey={selectedKey}
        activeModifiers={activeModifiers}
      />{' '}
      <Container>
        <Stack>
          {selectedActions.length > 0 ? (
            selectedActions.map((selectedAction) => (
              <React.Fragment key={selectedAction.identifier}>
                <Group>
                  <Text>Name: {selectedAction.name}</Text>
                  <Keybind
                    selectedKey={selectedKey}
                    modifiers={activeModifiers}
                  ></Keybind>
                </Group>
                <Text>Description: {selectedAction.documentation}</Text>
                <Text>Is Local: {selectedAction.synchronization ? 'Yes' : 'No'}</Text>
                <Text>GUI Path: {selectedAction.guiPath}</Text>
              </React.Fragment>
            ))
          ) : selectedKey === '' && activeModifiers.length === 0 ? (
            <Text>No key selected. Select a key to see its action</Text>
          ) : (
            <>
              <Keybind selectedKey={selectedKey} modifiers={activeModifiers}></Keybind>
              <Text>No action is associated with this keybind</Text>
            </>
          )}
        </Stack>
      </Container>
    </>
  );
  //;
  // return (
  //   <Container>
  //     <Title>Keybinds</Title>
  //     <FilterList showMoreButton>
  //       <FilterList.Favorites></FilterList.Favorites>
  //       <FilterList.Data<KeybindType>
  //         data={keybinds}
  //         renderElement={(element) => (
  //           <Keybind
  //             key={`${element.action}${element.key}`}
  //             action={actions.find((action) => action.identifier === element.action)!}
  //             keybind={element}
  //           />
  //         )}
  //         matcherFunc={generateMatcherFunctionByKeys(['action', 'key', 'modifiers'])}
  //       ></FilterList.Data>
  //     </FilterList>
  //   </Container>
  // );
}
