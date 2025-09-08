import { useState } from 'react';
import { ActionIcon, Button, Group } from '@mantine/core';

import { useOpenSpaceApi } from '@/api/hooks';
import { StringInput } from '@/components/Input/StringInput';
import { PauseIcon, PlayIcon, StopIcon } from '@/icons/icons';

import { KeyframeInfo } from './KeyframeInfo';
import { Timeline } from './Timeline';
import { KeyframeEntry } from './types';

export function SessionRecordingKeyframesPanel() {
  const luaApi = useOpenSpaceApi();

  const [file, setFile] = useState<string>('');
  const [keyframes, setKeyframes] = useState<KeyframeEntry[]>([]);
  const [selectedKeyframeIDs, setSelectedKeyframeIDs] = useState<number[]>([]);
  const [playheadTime, setPlayheadTime] = useState(0);

  async function onMove(ids: number[], delta: number) {
    if (!luaApi) {
      return;
    }

    // Find the keyframe indices and move them
    for (const id of ids) {
      const index = keyframes.findIndex((kf) => kf.Id === id);
      if (index === -1) {
        continue;
      }
      const kfTime = keyframes[index].Timestamp;
      const newTime = kfTime + delta;
      await luaApi.keyframeRecording.moveKeyframe(index, newTime);
      // Keyframes may have changed order after moving, so we refresh the list
      await getKeyframes();
    }
  }

  async function getKeyframes() {
    const obj = await luaApi?.keyframeRecording.keyframes();
    if (obj) {
      const kfs = Object.values(obj) as KeyframeEntry[];
      setKeyframes(kfs);
    }
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
      <Button
        onClick={() => {
          luaApi?.keyframeRecording.addCameraKeyframe(playheadTime);
          getKeyframes();
        }}
      >
        Add Camera Keyframe
      </Button>
      <StringInput
        onEnter={(value) => {
          luaApi?.keyframeRecording.addScriptKeyframe(playheadTime, value);
          getKeyframes();
        }}
        value={''}
        label={'Add Script Keyframe'}
      />
      <Timeline
        keyframes={keyframes}
        selectedKeyframeIDs={selectedKeyframeIDs}
        playheadTime={playheadTime}
        onPlayheadChange={setPlayheadTime}
        onMoveKeyframes={onMove}
        onSelectKeyframes={(ids, isAdditive) => {
          if (isAdditive) {
            // Add keyframe to selection
            setSelectedKeyframeIDs((prev) => [...new Set([...prev, ...ids])]);
          } else {
            setSelectedKeyframeIDs(ids);
          }
        }}
      />
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
      {selectedKeyframeIDs.map((id) => (
        <KeyframeInfo key={id} id={id} keyframes={keyframes} />
      ))}
    </>
  );
}
