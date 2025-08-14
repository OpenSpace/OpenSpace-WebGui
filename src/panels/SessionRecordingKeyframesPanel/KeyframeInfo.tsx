import { Text, Title } from '@mantine/core';
import { isCameraEntry, KeyframeEntry } from './types';

interface Props {
  keyframe: KeyframeEntry | null;
}

export function KeyframeInfo({ keyframe }: Props) {
  if (keyframe === null) {
    return <></>;
  }

  const isCameraKeyframe = isCameraEntry(keyframe);

  return (
    <>
      <Title order={2}>Keyframe</Title>
      <Text>Timestamp: {keyframe.Timestamp.toFixed(2)}</Text>
      {isCameraKeyframe ? (
        <Text>Focus node: {keyframe.Camera.FocusNode}</Text>
      ) : (
        <Text>Script: {keyframe.Script}</Text>
      )}
    </>
  );
}
