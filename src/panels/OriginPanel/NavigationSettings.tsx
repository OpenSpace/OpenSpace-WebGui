import { ActionIcon, Checkbox, Container, Divider, Group, Menu } from '@mantine/core';

import { InfoBox } from '@/components/InfoBox/InfoBox';
import { Property } from '@/components/Property/Property';
import { SettingsIcon } from '@/icons/icons';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setShowNonFocusableInNavMenu } from '@/redux/local/localSlice';
import {
  ApplyIdleBehaviorOnPathFinishKey,
  CameraPathArrivalDistanceFactorKey,
  CameraPathSpeedFactorKey,
  JumpToFadeDurationKey
} from '@/util/keys';

export function NavigationSettings() {
  const showNonfocusableInSearch = useAppSelector(
    (state) => state.local.menus.navigation.showNonFocusable
  );

  const dispatch = useAppDispatch();

  return (
    <Menu position={'right'} closeOnItemClick={false} withArrow>
      <Menu.Target>
        <ActionIcon>
          <SettingsIcon />
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Label>Focus Search</Menu.Label>
        <Container>
          <Group wrap={'nowrap'}>
            {/* TODO: add a setting for this in local state */}
            <Checkbox
              label={'Include Non-focusable Nodes'}
              checked={showNonfocusableInSearch}
              onChange={(event) => {
                dispatch(setShowNonFocusableInNavMenu(event.currentTarget.checked));
              }}
            />
            <InfoBox>
              Per default, nodes that are marked as non-focusable are excluded from the
              search in the navigation menu. Checking this option will include them and
              allowing setting these nodes as focus.
            </InfoBox>
          </Group>
        </Container>
        <Divider my={'xs'} />
        <Menu.Label>Navigation Settings</Menu.Label>
        <Container>
          <Property uri={JumpToFadeDurationKey} />
        </Container>
        <Divider my={'xs'} />
        <Menu.Label>Camera Path Settings</Menu.Label>
        <Container>
          <Property uri={CameraPathSpeedFactorKey} />
          <Property uri={CameraPathArrivalDistanceFactorKey} />
          <Property uri={ApplyIdleBehaviorOnPathFinishKey} />
        </Container>
      </Menu.Dropdown>
    </Menu>
  );
}
