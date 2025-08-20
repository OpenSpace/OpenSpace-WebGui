import { useOpenSpaceApi } from '@/api/hooks';
import { ActionIcon, Button, Group } from '@mantine/core';
import { useState } from 'react';
import { KeyframeEntry } from './types';
import { Timeline } from './Timeline';
import { StringInput } from '@/components/Input/StringInput';
import { KeyframeInfo } from './KeyframeInfo';
import { PauseIcon, PlayIcon, StopIcon } from '@/icons/icons';

export function SessionRecordingKeyframesPanel() {
  const luaApi = useOpenSpaceApi();

  const [file, setFile] = useState<string>('');
  const [keyframes, setKeyframes] = useState<KeyframeEntry[]>([]);
  const [selectedKeyframeID, setSelectedKeyframeID] = useState<number | null>(null);

  const selectedKeyframe = keyframes.find((kf) => kf.Id === selectedKeyframeID);

  async function onMove(index: number, newTime: number) {
    if (!luaApi) {
      return;
    }

    await luaApi.keyframeRecording.moveKeyframe(index, newTime);
    await getKeyframes();
  }

  async function getKeyframes() {
    const obj = await luaApi?.keyframeRecording.keyframes();
    if (obj) {
      const kfs = Object.values(obj) as KeyframeEntry[];
      setKeyframes(kfs);
    }
  }

  function onSelect(keyframe: KeyframeEntry) {
    setSelectedKeyframeID(keyframe.Id);
  }

  return (
    <>
      <Button onClick={getKeyframes}>Update keyframes</Button>
      <StringInput
        onEnter={async (value) => {
          await luaApi?.keyframeRecording.loadSequence(value);
          getKeyframes();
          setFile(value);
        }}
        value={file}
        label={'Load keyframes file'}
      />

      <Button onClick={() => luaApi?.keyframeRecording.addCameraKeyframe(5)}>
        Add Camera Keyframe
      </Button>

      <StringInput
        onEnter={(value) => luaApi?.keyframeRecording.addScriptKeyframe(5, value)}
        value=""
        label={'Add Script Keyframe'}
      />

      <Timeline
        keyframes={keyframes}
        selectedKeyframe={selectedKeyframe}
        onMove={onMove}
        onSelect={onSelect}
      />
      {selectedKeyframe && (
        <KeyframeInfo keyframe={selectedKeyframe} keyframes={keyframes} />
      )}
      <Group my={'xs'} gap={'xs'}>
        <ActionIcon
          onClick={async () => {
            const isPlayback = await luaApi?.sessionRecording.isPlayingBack();
            if (isPlayback) {
              luaApi?.sessionRecording.setPlaybackPause(false);
            } else {
              luaApi?.keyframeRecording.play();
            }
          }}
        >
          <PlayIcon />
        </ActionIcon>
        <ActionIcon onClick={() => luaApi?.keyframeRecording.pause()}>
          <PauseIcon />
        </ActionIcon>
        <ActionIcon onClick={() => luaApi?.sessionRecording.stopPlayback()}>
          <StopIcon />
        </ActionIcon>
      </Group>
    </>
  );
}
