import { useOpenSpaceApi } from '@/api/hooks';
import { Button } from '@mantine/core';
import { useState } from 'react';
import { KeyframeEntry } from './types';
import { Timeline } from './Timeline';
import { StringInput } from '@/components/Input/StringInput';
import { KeyframeInfo } from './KeyframeInfo';

export function SessionRecordingKeyframesPanel() {
  const luaApi = useOpenSpaceApi();

  const [file, setFile] = useState<string>('');
  const [keyframes, setKeyframes] = useState<KeyframeEntry[]>([]);
  const [selectedKeyframe, setSelectedKeyframe] = useState<KeyframeEntry | null>(null);

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
    if (selectedKeyframe) {
      selectedKeyframe.selected = false;
    }
    keyframe.selected = true;
    setSelectedKeyframe(keyframe);
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

      <Timeline keyframes={keyframes} onMove={onMove} onSelect={onSelect} />
      <KeyframeInfo keyframe={selectedKeyframe} />
    </>
  );
}
