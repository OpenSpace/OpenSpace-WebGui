import { Button, Container, Divider, Group, ScrollArea, Title } from '@mantine/core';

import { useOpenSpaceApi, useSetOpenSpaceTime } from '@/api/hooks';

import { TimeInput } from './TimeInput/TimeInput';
import { SimulationIncrement } from './SimulationIncrement';

export function TimePanel() {
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

  return (
    <ScrollArea h={'100%'}>
      <Container>
        <Title order={2}>Select Time</Title>
        <TimeInput />
        <Title order={2}>Simulation Speed</Title>
        <SimulationIncrement />
        <Divider my={'xs'} />
        <Group grow gap={'xs'}>
          <Button onClick={realTime}>Realtime</Button>
          <Button onClick={now}>Now</Button>
        </Group>
      </Container>
    </ScrollArea>
  );
}
