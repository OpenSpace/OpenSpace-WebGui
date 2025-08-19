import { Button, Text, Title } from '@mantine/core';
import { isCameraEntry, KeyframeEntry } from './types';
import { useOpenSpaceApi } from '@/api/hooks';

interface Props {
  keyframe: KeyframeEntry | null;
  keyframes: KeyframeEntry[];
}

export function KeyframeInfo({ keyframe, keyframes }: Props) {
  const luaApi = useOpenSpaceApi();

  if (keyframe === null) {
    return <></>;
  }
  const index = keyframes.findIndex((kf) => kf.Id === keyframe?.Id);

  const isCameraKeyframe = isCameraEntry(keyframe);

  return (
    <>
      <Title order={2}>Keyframe</Title>
      <Text>Timestamp: {keyframe.Timestamp.toFixed(2)}</Text>
      {isCameraKeyframe ? (
        <>
          <Text>Focus node: {keyframe.Camera.FocusNode}</Text>
          <Button onClick={() => luaApi?.keyframeRecording.updateKeyframe(index)}>
            Update Camera Position
          </Button>
        </>
      ) : (
        <Text>Script: {keyframe.Script}</Text>
      )}
      <Button onClick={() => luaApi?.keyframeRecording.removeKeyframe(index)}>
        Remove keyframe
      </Button>
    </>
  );
}
