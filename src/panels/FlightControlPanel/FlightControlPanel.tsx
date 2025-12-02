import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { List, Slider, Space, Stack, Text } from '@mantine/core';

import { BoolInput } from '@/components/Input/BoolInput';
import { Label } from '@/components/Label/Label';
import {
  setFlightControllerEnabled,
  setFlightControllerInputScaleFactor
} from '@/redux/flightcontroller/flightControllerSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';

export function FlightControlPanel() {
  const { t } = useTranslation('panel-flightcontrol');

  const isControllerEnabled = useAppSelector((state) => state.flightController.isEnabled);
  const mouseScaleFactor = useAppSelector(
    (state) => state.flightController.inputScaleFactor
  );

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
    <>
      <Text>{t('description.intro')}</Text>
      <Space h={'xs'} />
      <Text fw={'bold'}>{t('description.mouse-title')}</Text>
      <Text>{t('description.mouse-body.text')}</Text>
      <List>
        {t('description.mouse-body.keybinds', { returnObjects: true }).map(
          (text, index) => (
            <List.Item key={index}>{text}</List.Item>
          )
        )}
      </List>
      <Space h={'xs'} />
      <Text fw={'bold'}>{t('description.touch-title')}</Text>
      <List>
        {t('description.touch-body.controls', { returnObjects: true }).map(
          (text, index) => (
            <List.Item key={index}>{text}</List.Item>
          )
        )}
      </List>
    </>
  );

  return (
    <Stack gap={'xs'}>
      <BoolInput
        label={t('toggle-flight-label')}
        info={infoBoxContent}
        value={isControllerEnabled}
        onChange={toggleFlightController}
      />

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
          onChange={(value) => dispatch(setFlightControllerInputScaleFactor(value))}
        />
      </Stack>
    </Stack>
  );
}
