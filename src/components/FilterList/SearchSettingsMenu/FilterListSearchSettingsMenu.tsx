import {
  ActionIcon,
  Checkbox,
  Group,
  Menu,
  Stack,
  ThemeIcon,
  Tooltip
} from '@mantine/core';

import { SettingsIcon, WarningIcon } from '@/icons/icons';
import { IconSize } from '@/types/enums';
import { camelCaseToRegularText } from '@/util/text';

interface Props<T extends object> {
  keys: Partial<Record<keyof T, boolean>>;
  setKey: (key: keyof T, enabled: boolean) => void;
  labels?: Partial<Record<keyof T, string>>;
}

export function FilterListSearchSettingsMenu<T extends object>({
  keys,
  setKey,
  labels
}: Props<T>) {
  const noKeyIsSelected = Object.values(keys).every((value) => value === false);
  return (
    <Menu position={'right-start'} withArrow closeOnItemClick={false}>
      <Menu.Target>
        <ActionIcon flex={'none'}>
          {noKeyIsSelected && (
            <Tooltip label={'Nothing is selected. Search will be empty.'}>
              <ThemeIcon
                color={'orange.4'}
                variant={'transparent'}
                size={12}
                style={{ position: 'absolute', top: 0, right: 0 }}
              >
                <WarningIcon size={IconSize.xs} />
              </ThemeIcon>
            </Tooltip>
          )}
          <SettingsIcon />
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown maw={'300px'}>
        <Menu.Label>Search in</Menu.Label>
        <Stack p={'xs'}>
          {/* When using Object.entries a new object is created, and we cant infer the type from that */}
          {Object.entries(keys).map(([key, enabled]) => (
            <Group key={key}>
              <Checkbox
                label={labels ? labels[key as keyof T] : camelCaseToRegularText(key)}
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
