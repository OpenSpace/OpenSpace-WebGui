import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Container, Group, List, Slider, Space, Stack, Text, Title } from '@mantine/core';

import { FrictionControls } from '@/components/FrictionControls/FrictionControls';
import { FrictionControlsInfo } from '@/components/FrictionControls/FrictionControlsInfo';
import { BoolInput } from '@/components/Input/BoolInput';
import { Label } from '@/components/Label/Label';
import {
  setFlightControllerEnabled,
  setFlightControllerInputScaleFactor
} from '@/redux/flightcontroller/flightControllerSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';

export function FlightControlPanel() {
  const isControllerEnabled = useAppSelector((state) => state.flightController.isEnabled);
  const mouseScaleFactor = useAppSelector(
    (state) => state.flightController.inputScaleFactor
  );
  const { t } = useTranslation('flightcontrolpanel');

  const dispatch = useAppDispatch();

  useEffect(() => {
    return () => {
      dispatch(setFlightControllerEnabled(false));
    };
  }, [dispatch]);

  function toggleFlightController() {
    dispatch(setFlightControllerEnabled(!isControllerEnabled));
  }

  const infoBoxContent = (
    <Container>
      <Text>{t('controller.description.intro')}</Text>
      <Space h={'xs'} />
      <Text fw={'bold'}>{t('controller.description.mouse-title')}</Text>
      <Text>{t('controller.description.mouse-body.text')}</Text>
      <List>
        <List.Item>{t('controller.description.mouse-body.list.shift')}</List.Item>
        <List.Item>{t('controller.description.mouse-body.list.ctrl')}</List.Item>
      </List>
      <Space h={'xs'} />
      <Text fw={'bold'}>{t('controller.description.touch-title')}</Text>
      <List>
        <List.Item>{t('controller.description.touch-body.list.1-finger')}</List.Item>
        <List.Item>{t('controller.description.touch-body.list.2-fingers')}</List.Item>
        <List.Item>{t('controller.description.touch-body.list.3-fingers')}</List.Item>
      </List>
    </Container>
  );

  return (
    <Stack gap={'xs'}>
      <BoolInput
        label={t('controller.label')}
        info={infoBoxContent}
        value={isControllerEnabled}
        onChange={toggleFlightController}
      />

      <Title order={2}>{t('settings-title')}</Title>
      <Stack gap={'xs'}>
        <Label name={t('friction-label')} info={<FrictionControlsInfo />} />
        <Group align={'start'}>
          <FrictionControls size={'sm'} />
        </Group>
      </Stack>

      <Stack gap={'xs'}>
        <Label name={t('sensitivity.label')} info={t('sensitivity.description')} />
        <Slider
          min={0.1}
          max={1}
          step={0.01}
          value={mouseScaleFactor}
          disabled={!isControllerEnabled}
          marks={[
            {
              value: 0.1,
              label: 0.1
            },
            {
              value: (1 - 0.1) / 2.0 + 0.1
            },
            {
              value: 1,
              label: 1
            }
          ]}
          onChange={(value) => {
            dispatch(setFlightControllerInputScaleFactor(value));
          }}
        />
      </Stack>
    </Stack>
  );
}
