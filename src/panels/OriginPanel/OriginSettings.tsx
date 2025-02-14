import { ActionIcon, Menu } from '@mantine/core';

import { Property } from '@/components/Property/Property';
import { SettingsIcon } from '@/icons/icons';
import {
  ApplyIdleBehaviorOnPathFinishKey,
  CameraPathArrivalDistanceFactorKey,
  CameraPathSpeedFactorKey,
  JumpToFadeDurationKey
} from '@/util/keys';

export function OriginSettings() {
  return (
    <Menu position={'right-start'} closeOnItemClick={false}>
      <Menu.Target>
        <ActionIcon>
          <SettingsIcon />
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Label>Camera Path Settings</Menu.Label>
        <Property uri={CameraPathSpeedFactorKey} />
        <Property uri={CameraPathArrivalDistanceFactorKey} />
        <Property uri={ApplyIdleBehaviorOnPathFinishKey} />
        <Property uri={JumpToFadeDurationKey} />
      </Menu.Dropdown>
    </Menu>
  );
}
