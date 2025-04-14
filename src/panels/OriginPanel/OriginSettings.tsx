import { Checkbox, Container, Divider, Group, Menu } from '@mantine/core';

import { InfoBox } from '@/components/InfoBox/InfoBox';
import { Property } from '@/components/Property/Property';
import { SettingsPopout } from '@/components/SettingsPopout/SettingsPopout';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setOnlyFocusableInNavMenu } from '@/redux/local/localSlice';
import {
  ApplyIdleBehaviorOnPathFinishKey,
  CameraPathArrivalDistanceFactorKey,
  CameraPathSpeedFactorKey,
  JumpToFadeDurationKey
} from '@/util/keys';

export function OriginSettings() {
  const showOnlyFocusableInSearch = useAppSelector(
    (state) => state.local.menus.navigation.onlyFocusable
  );

  const dispatch = useAppDispatch();

  return (
    <SettingsPopout title={'Navigation Settings'} position={'right'}>
      <Container>
        <Group wrap={'nowrap'} mb={'xs'}>
          <Checkbox
            label={'Include Non-focusable Nodes in Search'}
            checked={!showOnlyFocusableInSearch}
            onChange={(event) => {
              dispatch(setOnlyFocusableInNavMenu(!event.currentTarget.checked));
            }}
          />
          <InfoBox>
            Per default, nodes that are marked as non-focusable are excluded from the
            search in the navigation menu. Checking this option will include them and
            allowing setting these nodes as focus.
          </InfoBox>
        </Group>
        <Property uri={JumpToFadeDurationKey} />
      </Container>
      <Divider my={'xs'} />
      <Menu.Label>Camera Path Settings</Menu.Label>
      <Container>
        <Property uri={CameraPathSpeedFactorKey} />
        <Property uri={CameraPathArrivalDistanceFactorKey} />
        <Property uri={ApplyIdleBehaviorOnPathFinishKey} />
      </Container>
    </SettingsPopout>
  );
}
