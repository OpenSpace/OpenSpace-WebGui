import { Group, Stack, Box, Text, NumberFormatter, Title, Checkbox } from '@mantine/core';
import { MouseDescription } from '../MouseDescriptions';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { useEffect } from 'react';
import { subscribeToCamera, unsubscribeToCamera } from '@/redux/camera/cameraMiddleware';
import { useGetStringPropertyValue } from '@/api/hooks';
import { NavigationAnchorKey } from '@/util/keys';

export function AltitudeTask() {
  const altitude = useAppSelector((state) => state.camera.altitude);
  const unit = useAppSelector((state) => state.camera.altitudeUnit);
  const [anchor] = useGetStringPropertyValue(NavigationAnchorKey);

  const dispatch = useAppDispatch();

  const hasCorrectNode = anchor !== undefined && anchor !== '' && anchor === 'Earth';
  const hasCorrectAltitude = altitude !== undefined && altitude <= 3500 && unit === 'km';
  const taskCompleted = hasCorrectAltitude && hasCorrectNode;

  useEffect(() => {
    dispatch(subscribeToCamera());
    return () => {
      dispatch(unsubscribeToCamera());
    };
  }, []);

  return (
    <Group>
      <Stack flex={2}>
        <Title order={2}>Let's go closer to Earth!</Title>
        <Checkbox
          size={'lg'}
          c={'orange'}
          color="green"
          checked={taskCompleted}
          onChange={() => {}}
          label={'Task: Go to an altitude lower than 3500 km on Earth!'}
          style={{ cursor: 'default' }}
        />

        <Text>
          Current altitude:{' '}
          <NumberFormatter
            value={altitude}
            suffix={` ${unit}`}
            thousandSeparator
            decimalScale={0}
          />
        </Text>
        <Text>Current focus: {anchor ? anchor : 'None'}</Text>
        <Text c={'dimmed'} fs={'italic'}>
          The altitude is displayed at the top left corner of the screen. Right click and
          drag to go closer or further away.
        </Text>
      </Stack>
      <Box flex={1}>
        <MouseDescription />
      </Box>
    </Group>
  );
}
