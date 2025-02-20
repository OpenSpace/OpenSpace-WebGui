import { Container, Divider, ScrollArea } from '@mantine/core';

import { PlaySession } from './PlaySession';
import { RecordSession } from './RecordSession';

export function SessionRecordingPanel() {
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
