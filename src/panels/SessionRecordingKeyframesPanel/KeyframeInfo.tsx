import { Button, Text, Title } from '@mantine/core';
import { isCameraEntry, KeyframeEntry } from './types';
import { useOpenSpaceApi } from '@/api/hooks';

interface Props {
  id: number;
  keyframes: KeyframeEntry[];
}

export function KeyframeInfo({ id, keyframes }: Props) {
  const luaApi = useOpenSpaceApi();

  const keyframe = keyframes.find((kf) => kf.Id === id);
  const index = keyframes.findIndex((kf) => kf.Id === id);

  if (keyframe === undefined || index === -1) {
    return <></>;
  }

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
