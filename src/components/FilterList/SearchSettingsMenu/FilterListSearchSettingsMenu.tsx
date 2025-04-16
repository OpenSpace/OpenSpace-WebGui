import { SettingsIcon } from '@/icons/icons';
import { camelCaseToRegularText } from '@/util/text';
import { Menu, ActionIcon, Group, Checkbox, Stack } from '@mantine/core';

interface Props<T> {
  keys: Record<keyof T, boolean>;
  setKey: (key: keyof T, enabled: boolean) => void;
}

export function FilterListSearchSettingsMenu<T>({ keys, setKey }: Props<T>) {
  return (
    <Menu position={'right-start'} withArrow closeOnItemClick={false}>
      <Menu.Target>
        <ActionIcon>
          <SettingsIcon />
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown maw={'300px'}>
        <Menu.Label>Search these keys</Menu.Label>
        <Stack p={'xs'}>
          {Object.entries(keys).map(([key, enabled]) => (
            <Group key={key}>
              <Checkbox
                label={camelCaseToRegularText(key)}
                checked={enabled as boolean}
                onChange={(event) => setKey(key as keyof T, event.currentTarget.checked)}
              />
            </Group>
          ))}
        </Stack>
      </Menu.Dropdown>
    </Menu>
  );
}
