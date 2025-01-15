import { useEffect } from 'react';
import {
  Chip,
  Container,
  Group,
  List,
  Slider,
  Space,
  Switch,
  Text,
  Title
} from '@mantine/core';

import { useGetBoolPropertyValue } from '@/api/hooks';
import { Tooltip } from '@/components/Tooltip/Tooltip';
import {
  setFlightControllerEnabled,
  setFlightControllerInputScaleFactor
} from '@/redux/flightcontroller/flightControllerSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { RollFrictionKey, RotationalFrictionKey, ZoomFrictionKey } from '@/util/keys';

export function FlightControlPanel() {
  const dispatch = useAppDispatch();

  const isControllerEnabled = useAppSelector((state) => state.flightController.isEnabled);
  const mouseScaleFactor = useAppSelector(
    (state) => state.flightController.inputScaleFactor
  );

  const [rotationFrictionProperty, setRotationFrictionProperty] =
    useGetBoolPropertyValue(RotationalFrictionKey) ?? false;

  const [zoomFrictionProperty, setZoomFrictionProperty] =
    useGetBoolPropertyValue(ZoomFrictionKey) ?? false;

  const [rollFrictionProperty, setRollFrictionProperty] =
    useGetBoolPropertyValue(RollFrictionKey) ?? false;

  useEffect(() => {
    return () => {
      dispatch(setFlightControllerEnabled(false));
    };
  }, [dispatch]);

  function toggleEnabled() {
    dispatch(setFlightControllerEnabled(!isControllerEnabled));
  }

  function toggleRotation() {
    setRotationFrictionProperty(!rotationFrictionProperty);
  }

  function toggleZoom() {
    setZoomFrictionProperty(!zoomFrictionProperty);
  }

  function toggleRoll() {
    setRollFrictionProperty(!rollFrictionProperty);
  }

  const tooltipContent = (
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
    <Container>
      <Title order={2}>Flight Control</Title>
      <Group justify={'space-between'} my={'xs'} wrap={'nowrap'} align={'start'}>
        <Switch
          label={'Toggle flight control'}
          defaultChecked={isControllerEnabled}
          checked={isControllerEnabled}
          onChange={toggleEnabled}
        />
        <Tooltip text={tooltipContent} />
      </Group>
      <Title order={3}>Settings</Title>
      <Text>Friction control</Text>
      <Group gap={2} preventGrowOverflow={false} mb={'xs'}>
        <Chip onClick={toggleRotation} disabled={!isControllerEnabled}>
          Rotation
        </Chip>
        <Chip onClick={toggleZoom} disabled={!isControllerEnabled}>
          Zoom
        </Chip>
        <Chip onClick={toggleRoll} disabled={!isControllerEnabled}>
          Roll
        </Chip>
      </Group>
      <Group justify={'space-between'} align={'start'} wrap={'nowrap'}>
        <Text>Input sensitivity</Text>
        <Tooltip text={'Controls how sensitive the touch and mouse inputs are'} />
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
    </Container>
  );
}
