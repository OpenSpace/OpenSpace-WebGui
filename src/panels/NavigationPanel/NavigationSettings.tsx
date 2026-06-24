import { useTranslation } from 'react-i18next';
import {
  Box,
  Checkbox,
  Container,
  Divider,
  Group,
  Menu,
  NumberInput,
  Stack
} from '@mantine/core';

import { BoolInput } from '@/components/Input/BoolInput';
import { NumericSlider } from '@/components/Input/NumericInput/NumericSlider/NumericSlider';
import { Property } from '@/components/Property/Property';
import { SettingsPopout } from '@/components/SettingsPopout/SettingsPopout';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  setFlyToOverrideDuration,
  setFlyToOverrideDurationEnabled,
  setOnlyFocusableInNavMenu
} from '@/redux/local/localSlice';
import {
  ApplyIdleMotionOnPathFinishKey,
  CameraPathArrivalDistanceFactorKey,
  CameraPathSpeedFactorKey,
  JumpToFadeDurationKey
} from '@/util/keys';

export function NavigationSettings() {
  const { t } = useTranslation('panel-navigation', { keyPrefix: 'navigation-settings' });

  const showOnlyFocusableInSearch = useAppSelector(
    (state) => state.local.menus.navigation.onlyFocusable
  );

  const flyToOverrideDuration = useAppSelector(
    (state) => state.local.menus.navigation.flyToOverrideDuration
  );

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
        <Property uri={ApplyIdleMotionOnPathFinishKey} />
        <Stack gap={'xs'} mt={'xs'}>
          <Checkbox
            label={t('override-fly-to-duration-label')}
            checked={flyToOverrideDuration.enabled}
            onChange={(event) =>
              dispatch(setFlyToOverrideDurationEnabled(event.currentTarget.checked))
            }
          />
          <Group gap={'xs'} wrap={'nowrap'} align={'center'}>
            <Box style={{ flex: 1 }}>
              <NumericSlider
                min={0}
                max={60}
                step={0.25}
                value={flyToOverrideDuration.duration}
                disabled={!flyToOverrideDuration.enabled}
                onInput={(value) => dispatch(setFlyToOverrideDuration(value))}
              />
            </Box>
            <NumberInput
              size={'xs'}
              w={70}
              min={0}
              max={60}
              step={1.25}
              suffix={'s'}
              disabled={!flyToOverrideDuration.enabled}
              value={flyToOverrideDuration.duration}
              onChange={(value) =>
                dispatch(setFlyToOverrideDuration(typeof value === 'number' ? value : 0))
              }
            />
          </Group>
        </Stack>
      </Container>
    </SettingsPopout>
  );
}
