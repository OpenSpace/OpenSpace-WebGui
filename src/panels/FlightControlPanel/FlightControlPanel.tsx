import { useEffect } from 'react';
import { Chip, Container, Group, List, Slider, Switch, Text, Title } from '@mantine/core';

import { useGetBoolPropertyValue, useOpenSpaceApi } from '@/api/hooks';
import { Tooltip } from '@/components/Tooltip/Tooltip';
import { setSettings } from '@/redux/flightcontroller/flightControllerSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  subscribeToProperty,
  unsubscribeToProperty
} from '@/redux/propertytree/properties/propertiesMiddleware';
import { RollFrictionKey, RotationalFrictionKey, ZoomFrictionKey } from '@/util/keys';

export function FlightControlPanel() {
  const luaApi = useOpenSpaceApi();
  const dispatch = useAppDispatch();

  const isControllerEnabled = useAppSelector(
    (state) => state.flightController.settings.isEnabled
  );
  const mouseScaleFactor = useAppSelector(
    (state) => state.flightController.settings.inputScaleFactor
  );

  const rotationFriction = useGetBoolPropertyValue(RotationalFrictionKey) ?? false;
  const zoomFriction = useGetBoolPropertyValue(ZoomFrictionKey) ?? false;
  const rollFriction = useGetBoolPropertyValue(RollFrictionKey) ?? false;

  useEffect(() => {
    function subscribeTo(uri: string) {
      dispatch(subscribeToProperty({ uri }));
    }
    function unsubscribeTo(uri: string) {
      dispatch(unsubscribeToProperty({ uri }));
    }

    subscribeTo(RotationalFrictionKey);
    subscribeTo(ZoomFrictionKey);
    subscribeTo(RollFrictionKey);

    return () => {
      unsubscribeTo(RotationalFrictionKey);
      unsubscribeTo(ZoomFrictionKey);
      unsubscribeTo(RollFrictionKey);
      dispatch(setSettings({ isEnabled: false }));
    };
  }, [dispatch]);

  function toggleEnable() {
    dispatch(setSettings({ isEnabled: !isControllerEnabled }));
  }

  function toggleRotation() {
    luaApi?.setPropertyValueSingle(RotationalFrictionKey, !rotationFriction);
  }

  function toggleZoom() {
    luaApi?.setPropertyValueSingle(ZoomFrictionKey, !zoomFriction);
  }

  function toggleRoll() {
    luaApi?.setPropertyValueSingle(RollFrictionKey, !rollFriction);
  }

  const tooltipContent = (
    <Container>
      <Text>Interact with the area to control the camera.</Text>
      <br />
      <Text fw={'bold'}>Mouse controls:</Text>
      <Text>Click and drag to rotate. Hold</Text>
      <List>
        <List.Item>Shift to zoom (y-axis) or roll (x-axis) </List.Item>
        <List.Item>Ctrl to pan </List.Item>
      </List>
      <br />
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
      <Title order={4}>Flight Control Settings</Title>
      <Group justify={'space-between'}>
        <Switch
          label={'Toggle flight control'}
          defaultChecked={isControllerEnabled}
          checked={isControllerEnabled}
          onChange={toggleEnable}
          my={'xs'}
        />
        <Tooltip text={tooltipContent} />
      </Group>
      <Text>Friction control</Text>
      <Group gap={2} preventGrowOverflow={false} grow mb={'xs'}>
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
      <Group justify={'space-between'} align={'center'}>
        <Text>Input sensitivity</Text>
        <Tooltip text={'Controls how sensitive the touch and mouse inputs are.'} />
      </Group>
      <Slider
        min={0.1}
        max={1}
        step={0.01}
        value={mouseScaleFactor}
        disabled={!isControllerEnabled}
        marks={[
          {
            value: 0,
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
          if (typeof value === 'number') {
            dispatch(setSettings({ inputscaleFactor: value }));
          }
        }}
      ></Slider>
    </Container>
  );
}
