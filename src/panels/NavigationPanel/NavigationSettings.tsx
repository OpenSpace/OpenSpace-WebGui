import { useTranslation } from 'react-i18next';
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

  const { t } = useTranslation('panel-navigation', { keyPrefix: 'navigation-settings' });

  const dispatch = useAppDispatch();

  return (
    <SettingsPopout title={t('title')} position={'right'}>
      <Container>
        <BoolInput
          label={t('include-non-focusable-label')}
          value={!showOnlyFocusableInSearch}
          onChange={(value: boolean) => dispatch(setOnlyFocusableInNavMenu(!value))}
          info={t('include-non-focusable-description')}
          mb={'xs'}
        />
        <Property uri={JumpToFadeDurationKey} />
      </Container>
      <Divider my={'xs'} />
      <Menu.Label>{t('camera-path-settings')}</Menu.Label>
      <Container>
        <Property uri={CameraPathSpeedFactorKey} />
        <Property uri={CameraPathArrivalDistanceFactorKey} />
        <Property uri={ApplyIdleBehaviorOnPathFinishKey} />
      </Container>
    </SettingsPopout>
  );
}
