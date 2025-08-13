import { useOpenSpaceApi } from '@/api/hooks';
import { Button, TextInput } from '@mantine/core';
import { useRef, useState } from 'react';
import { KeyframeEntry } from './types';
import { Timeline } from './Timeline';
import { StringInput } from '@/components/Input/StringInput';

export function SessionRecordingKeyframesPanel() {
  const luaApi = useOpenSpaceApi();

  const [file, setFile] = useState<string>('');
  const [keyframes, setKeyframes] = useState<KeyframeEntry[]>([]);
  const ref = useRef<HTMLDivElement>(null);
  console.log(ref.current?.clientWidth);

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

      <Timeline keyframes={keyframes} onMove={onMove} />
    </>
  );
}
