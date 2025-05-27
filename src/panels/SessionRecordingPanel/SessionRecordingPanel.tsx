import { Divider } from '@mantine/core';

import { PlaySession } from './PlaySession';
import { RecordSession } from './RecordSession';

export function SessionRecordingPanel() {
  return (
    <>
      <RecordSession />
      <Divider my={'xs'} />
      <PlaySession />
    </>
  );
}
