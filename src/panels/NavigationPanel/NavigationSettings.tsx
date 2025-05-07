import { Container, Divider, Menu } from '@mantine/core';

import { BoolInput } from '@/components/Input/BoolInput';
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

export function NavigationSettings() {
  const showOnlyFocusableInSearch = useAppSelector(
    (state) => state.local.menus.navigation.onlyFocusable
  );

  const dispatch = useAppDispatch();

  return (
    <SettingsPopout title={'Navigation Settings'} position={'right'}>
      <Container>
        <BoolInput
          name={'Include Non-focusable Nodes in Search'}
          value={!showOnlyFocusableInSearch}
          setValue={(value: boolean) => dispatch(setOnlyFocusableInNavMenu(!value))}
          info={`Per default, nodes that are marked as non-focusable are excluded from the
            search in the navigation menu. Checking this option will include them and
            allowing setting these nodes as focus.`}
          mb={'xs'}
        />
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
