import { Container } from '@mantine/core';

import { SimulationIncrement } from './SimulationIncrement';
import { TimeInput } from './TimeInput';

export function TimePanel() {
  return (
    <Container>
      <h2>Select Date</h2>
      <TimeInput />
      <h2>Simulation Speed</h2>
      <SimulationIncrement />
    </Container>
  );
}
