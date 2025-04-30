import { Alert, Button, Divider, Group, Stack, Text, Title } from '@mantine/core';

import { useOpenSpaceApi } from '@/api/hooks';
import { LoadingBlocks } from '@/components/LoadingBlocks/LoadingBlocks';
import { useSetOpenSpaceTime } from '@/hooks/util';
import { useAppSelector } from '@/redux/hooks';
import { TimeStatus } from '@/types/enums';

import { TimeInput } from './TimeInput/TimeInput';
import { SimulationIncrement } from './SimulationIncrement';

export function TimePanel() {
  const status = useAppSelector((state) => state.time.status);
  const backupTimeString = useAppSelector((state) => state.time.timeString);

  const luaApi = useOpenSpaceApi();
  const { setTime } = useSetOpenSpaceTime();

  function realTime(event: React.MouseEvent<HTMLElement>) {
    if (event.shiftKey) {
      luaApi?.time.setDeltaTime(1);
    } else {
      luaApi?.time.interpolateDeltaTime(1);
    }
  }

  function now() {
    // This date object will be in the local timezone but
    // the setTime function will convert it to UTC
    setTime(new Date());
  }

  if (status === TimeStatus.Uninitialized) {
    return <LoadingBlocks />;
  }

  return (
    <>
      <Title order={2}>Select Time</Title>
      {status === TimeStatus.OutsideRange ? (
        <Alert color={'red'}>
          <Stack align={'center'} gap={2} pb={'xs'}>
            <Text>{backupTimeString}</Text>
            <Text c={'red'}>
              Can't interact with dates outside the range April 20, 271821 BC to Sep 13,
              275760 AD.
            </Text>
          </Stack>
        </Alert>
      ) : (
        <TimeInput />
      )}
      <Title order={2}>Simulation Speed</Title>
      <SimulationIncrement />
      <Divider my={'xs'} />
      <Group grow gap={'xs'}>
        <Button onClick={realTime}>Realtime</Button>
        <Button onClick={now}>Now</Button>
      </Group>
    </>
  );
}
