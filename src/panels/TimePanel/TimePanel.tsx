import { Button, Container, Divider, Group, ScrollArea } from '@mantine/core';

import { useOpenSpaceApi } from '@/api/hooks';

import { SimulationIncrement } from './SimulationIncrement';
import { TimeInput } from './TimeInput';
import { setDate } from './util';

export function TimePanel() {
  const luaApi = useOpenSpaceApi();

  function realTime(event: React.MouseEvent<HTMLElement>) {
    if (event.shiftKey) {
      luaApi?.time.setDeltaTime(1);
    } else {
      luaApi?.time.interpolateDeltaTime(1);
    }
  }

  function now() {
    // This date object will be in the local timezone but
    // the setDate function will convert it to UTC
    setDate(luaApi, new Date());
  }

  return (
    <ScrollArea h={'100%'}>
      <Container>
        <h2>Select Date</h2>
        <TimeInput />
        <h2>Simulation Speed</h2>
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
