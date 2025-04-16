import { useEffect } from 'react';
import {
  Checkbox,
  Container,
  Group,
  List,
  Slider,
  Space,
  Text,
  Title
} from '@mantine/core';

import { FrictionControls } from '@/components/FrictionControls/FrictionControls';
import { InfoBox } from '@/components/InfoBox/InfoBox';
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
    <>
      <Title order={2}>Flight Control</Title>

      <Group justify={'space-between'} my={'xs'} wrap={'nowrap'} align={'start'}>
        <Checkbox
          label={'Toggle flight control'}
          checked={isControllerEnabled}
          onChange={toggleFlightController}
        />

        <InfoBox>{infoBoxContent}</InfoBox>
      </Group>

      <Title order={3}>Settings</Title>
      <Text>Friction control</Text>
      <FrictionControls size={'sm'} gap={'xs'} align={'start'} justify="space-between" />
      <Group justify={'space-between'} align={'start'} wrap={'nowrap'}>
        <Text>Input sensitivity</Text>
        <InfoBox>Controls how sensitive the touch and mouse inputs are</InfoBox>
      </Group>
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
      ></Slider>
    </>
  );
}
