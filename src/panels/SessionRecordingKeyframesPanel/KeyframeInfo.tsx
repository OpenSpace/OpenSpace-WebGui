import { Button, Text, Title } from '@mantine/core';

import { useOpenSpaceApi } from '@/api/hooks';
import { DeleteIcon } from '@/icons/icons';
import { IconSize } from '@/types/enums';

import { isCameraEntry, KeyframeEntry } from './types';

interface Props {
  id: number;
  keyframes: KeyframeEntry[];
}

export function KeyframeInfo({ id, keyframes }: Props) {
  const luaApi = useOpenSpaceApi();

  const keyframe = keyframes.find((kf) => kf.Id === id);

  if (keyframe === undefined) {
    return <></>;
  }

  const isCameraKeyframe = isCameraEntry(keyframe);

  return (
    <>
      <Title order={2}>Keyframe</Title>
      <Text>id: {id}</Text>
      <Text>Timestamp: {keyframe.Timestamp.toFixed(2)}</Text>
      {isCameraKeyframe ? (
        <>
          <Text>Focus node: {keyframe.Camera.FocusNode}</Text>
          <Button onClick={() => luaApi?.keyframeRecording.updateKeyframeById(id)}>
            Update Camera Position
          </Button>
        </>
      ) : (
        <Text>Script: {keyframe.Script}</Text>
      )}
      <Button
        onClick={() => luaApi?.keyframeRecording.removeKeyframeById(id)}
        color={'red'}
        variant={'outline'}
        leftSection={<DeleteIcon size={IconSize.xs} />}
      >
        Remove keyframe
      </Button>
    </>
  );
}
