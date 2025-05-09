import { useEffect } from 'react';
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
      <Text>Interact with the highlighted area to control the camera.</Text>
      <Space h={'xs'} />
      <Text fw={'bold'}>Mouse controls:</Text>
      <Text>Click and drag to rotate. Hold</Text>
      <List>
        <List.Item>Shift to zoom (y-axis) or roll (x-axis)</List.Item>
        <List.Item>Ctrl to pan</List.Item>
      </List>
      <Space h={'xs'} />
      <Text fw={'bold'}>Touch controls:</Text>
      <List>
        <List.Item>1 finger to rotate</List.Item>
        <List.Item>2 fingers to pan</List.Item>
        <List.Item>3 fingers to zoom (y-axis) or roll (x-axis)</List.Item>
      </List>
    </Container>
  );

  return (
    <Stack gap={'xs'}>
      <BoolInput
        label={'Toggle flight control'}
        info={infoBoxContent}
        value={isControllerEnabled}
        setValue={toggleFlightController}
      />

      <Title order={2}>Settings</Title>
      <Stack gap={'xs'}>
        <Label name={'Friction control'} info={<FrictionControlsInfo />} />
        <Group align={'start'}>
          <FrictionControls size={'sm'} />
        </Group>
      </Stack>

      <Stack gap={'xs'}>
        <Label
          name={'Input sensitivity'}
          info={'Controls how sensitive the touch and mouse inputs are'}
        />
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
