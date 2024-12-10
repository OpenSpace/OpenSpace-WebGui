import { FilterList } from '@/components/FilterList/FilterList';
import { generateMatcherFunctionByKeys } from '@/components/FilterList/util';
import { useAppSelector } from '@/redux/hooks';
import { Keybind as KeybindType } from '@/types/types';
import { Container, Group, Kbd, Title, Text } from '@mantine/core';
import { Keybind } from './Keybind';

export function KeyBindsPanel() {
  const keybinds = useAppSelector((state) => state.actions.keybinds);
  const actions = useAppSelector((state) => state.actions.actions);

  return (
    <Container>
      <Title>Keybinds</Title>
      <FilterList showMoreButton>
        <FilterList.Favorites></FilterList.Favorites>
        <FilterList.Data<KeybindType>
          data={keybinds}
          renderElement={(element) => (
            <Keybind
              key={`${element.action}${element.key}`}
              action={actions.find((action) => action.identifier === element.action)!}
              keybind={element}
            />
          )}
          matcherFunc={generateMatcherFunctionByKeys(['action', 'key', 'modifiers'])}
        ></FilterList.Data>
      </FilterList>
    </Container>
  );
}
