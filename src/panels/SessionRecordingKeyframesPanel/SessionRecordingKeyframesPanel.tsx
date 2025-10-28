import { useState } from 'react';
import { Button } from '@mantine/core';

import { useOpenSpaceApi } from '@/api/hooks';
import { StringInput } from '@/components/Input/StringInput';

import { KeyframeInfo } from './KeyframeInfo';
import { PlaybackControls } from './PlaybackControls';
import { Timeline } from './Timeline';
import { KeyframeEntry } from './types';

export function SessionRecordingKeyframesPanel() {
  const [file, setFile] = useState<string>('');
  const [keyframes, setKeyframes] = useState<KeyframeEntry[]>([]);
  const [selectedKeyframeIDs, setSelectedKeyframeIDs] = useState<number[]>([]);
  const [playheadTime, setPlayheadTime] = useState(0);

  const luaApi = useOpenSpaceApi();
  async function moveKeyframes(ids: number[], delta: number) {
    if (!luaApi) {
      return;
    }

    for (const id of ids) {
      const keyframe = keyframes.find((kf) => kf.Id === id);

      if (!keyframe) {
        continue;
      }
      const kfTime = keyframe.Timestamp;
      const newTime = Math.max(0, kfTime + delta);

      await luaApi.keyframeRecording.moveKeyframeById(id, newTime);
    }
    await getKeyframes();
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
      <Button
        onClick={async () => {
          const newData = await luaApi?.keyframeRecording.reduceKeyframes();
          if (newData) {
            setKeyframes(Object.values(newData) as KeyframeEntry[]);
          }
          console.log(Object.values(newData).length);
        }}
      >
        Simplify keyframes
      </Button>
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
        placeholder={'Type your script here'}
        mb={'xs'}
      />
      <Timeline
        keyframes={keyframes}
        selectedKeyframeIDs={selectedKeyframeIDs}
        playheadTime={playheadTime}
        onPlayheadChange={setPlayheadTime}
        onMoveKeyframes={moveKeyframes}
        onSelectKeyframes={(ids, isAdditive) => {
          if (isAdditive) {
            // Add keyframe to selection
            setSelectedKeyframeIDs((prev) => [...new Set([...prev, ...ids])]);
          } else {
            setSelectedKeyframeIDs(ids);
          }
        }}
      />

      <PlaybackControls />

      {selectedKeyframeIDs.length > 1 && (
        <Button
          onClick={() => {
            for (const id of selectedKeyframeIDs) {
              luaApi?.keyframeRecording.removeKeyframeById(id);
            }
          }}
        >
          Delete multiple
        </Button>
      )}

      {selectedKeyframeIDs.map((id) => (
        <KeyframeInfo key={id} id={id} keyframes={keyframes} />
      ))}
    </>
  );
}
