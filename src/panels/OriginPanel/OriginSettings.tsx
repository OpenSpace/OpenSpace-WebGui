import { ActionIcon, Checkbox, Menu } from '@mantine/core';

import { SettingsIcon } from '@/icons/icons';

export function OriginSettings() {
  return (
    <Menu position={'right-start'} closeOnItemClick={false}>
      <Menu.Target>
        <ActionIcon>
          <SettingsIcon />
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown>
        <Checkbox
          label={'Close window after selecting'}
          onChange={() => console.error('TODO: implement checkbox function')}
        />
        <Menu.Item>TODO: Property settings 1</Menu.Item>
        <Menu.Item>TODO: Property settings 2</Menu.Item>
        <Menu.Item>TODO: Property settings 3</Menu.Item>
        <Menu.Item>TODO: Property settings 4</Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
