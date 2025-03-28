import { Container } from '@mantine/core';

import { Property } from '@/components/Property/Property';
import { SettingsPopout } from '@/components/SettingsPopout/SettingsPopout';
import {
  ApplyIdleBehaviorOnPathFinishKey,
  CameraPathArrivalDistanceFactorKey,
  CameraPathSpeedFactorKey,
  JumpToFadeDurationKey
} from '@/util/keys';

export function OriginSettings() {
  return (
    <SettingsPopout title={'Camera Path Settings'}>
      <Container>
        <Property uri={CameraPathSpeedFactorKey} />
        <Property uri={CameraPathArrivalDistanceFactorKey} />
        <Property uri={ApplyIdleBehaviorOnPathFinishKey} />
        <Property uri={JumpToFadeDurationKey} />
      </Container>
    </SettingsPopout>
  );
}
