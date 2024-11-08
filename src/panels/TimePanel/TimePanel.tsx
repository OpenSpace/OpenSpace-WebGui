import { useEffect } from 'react';
import { Container } from '@mantine/core';

import { useAppDispatch } from '@/redux/hooks';
import { subscribeToTime, unsubscribeToTime } from '@/redux/time/timeMiddleware';

import { TimeInput } from './TimeInput';

export function TimePanel() {
  return (
    <Container>
      <h2>Select Date</h2>
      <TimeInput />
    </Container>
  );
}
