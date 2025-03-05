import { Group, Stack, Box, Text } from '@mantine/core';
import { MouseDescription } from '../MouseDescriptions';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { useEffect } from 'react';
import { subscribeToCamera, unsubscribeToCamera } from '@/redux/camera/cameraMiddleware';

export function AltitudeTask() {
  const altitude = useAppSelector((state) => state.camera.altitude);
  console.log(altitude);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(subscribeToCamera());
    return () => {
      dispatch(unsubscribeToCamera());
    };
  }, []);
  return (
    <Group>
      <Stack flex={2}>
        <Text>Let's go closer to Earth!</Text>
        <Text size="lg" fs={'italic'} c={'orange'}>
          Task: Go to an altitude of max 3500 km!
        </Text>
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
