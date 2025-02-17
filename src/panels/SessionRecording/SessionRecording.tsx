import { Container, Divider, ScrollArea } from '@mantine/core';

import { RecordSession } from './RecordSession';
import { PlaySession } from './PlaySession';

export function SessionRecording() {
  return (
    <ScrollArea h={'100%'}>
      <Container>
        <RecordSession />
        <Divider my={'xs'} />
        <PlaySession />
      </Container>
    </ScrollArea>
  );
}
