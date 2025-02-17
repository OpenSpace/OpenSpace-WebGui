import { useOpenSpaceApi, useSubscribeToSessionRecording } from '@/api/hooks';
import { InfoBox } from '@/components/InfoBox/InfoBox';
import { useAppSelector } from '@/redux/hooks';
import { Button, Checkbox, Group, Select, Stack, TextInput } from '@mantine/core';
import { useState } from 'react';
import { RecordingState } from './types';
import { RecordingsFolderKey } from '@/util/keys';
import { PlayIcon, StopIcon } from '@/icons/icons';

export function PlaySession() {
  const [loopPlayback, setLoopPlayback] = useState(false);
  const [shouldOutputFrames, setShouldOutputFrames] = useState(false);
  const [outputFramerate, setOutputFramerate] = useState(60);
  const [filenamePlayback, setFilenamePlayback] = useState<string | null>(null);

  const fileList = useAppSelector((state) => state.sessionRecording.files);
  const recordingState = useSubscribeToSessionRecording();
  const luaApi = useOpenSpaceApi();

  function onLoopPlaybackChange(event: React.ChangeEvent<HTMLInputElement>): void {
    if (event.currentTarget.checked) {
      setLoopPlayback(true);
      setShouldOutputFrames(false);
    } else {
      setLoopPlayback(false);
    }
  }

  function onShouldUpdateFramesChange(event: React.ChangeEvent<HTMLInputElement>): void {
    if (event.currentTarget.checked) {
      setShouldOutputFrames(true);
      setLoopPlayback(false);
    } else {
      setShouldOutputFrames(false);
    }
  }
  function isIdle() {
    return recordingState === RecordingState.Idle;
  }

  function togglePlayback(): void {
    if (isIdle()) {
      startPlayback();
    } else {
      stopPlayback();
    }
  }

  async function startPlayback(): Promise<void> {
    const shouldWaitForTiles = true;
    const filePath = await luaApi?.absPath(`${RecordingsFolderKey}${filenamePlayback}`);
    if (!filePath) {
      return; // TODO: notification about error
    }
    if (shouldOutputFrames) {
      luaApi?.sessionRecording.startPlayback(
        filePath,
        loopPlayback,
        shouldWaitForTiles,
        outputFramerate
      );
    } else {
      luaApi?.sessionRecording.startPlayback(filePath, loopPlayback, shouldWaitForTiles);
    }
  }

  function stopPlayback(): void {
    luaApi?.sessionRecording.stopPlayback();
  }

  function playbackButtonStateProperties(): {
    text: string;
    color: string | undefined;
    icon: React.JSX.Element;
  } {
    switch (recordingState) {
      case RecordingState.Playing:
      case RecordingState.Paused:
        return { text: 'Stop Playback', color: 'red', icon: <StopIcon /> };
      default:
        // Use default color
        return { text: 'Play', color: undefined, icon: <PlayIcon /> };
    }
  }

  const playbackButtonProps = playbackButtonStateProperties();

  return (
    <>
      <h2 style={{ marginTop: 0 }}>Play Session</h2>
      <Stack gap={'xs'}>
        <Checkbox
          label={'Loop playback'}
          checked={loopPlayback}
          onChange={onLoopPlaybackChange}
        />
        <Group>
          <Checkbox
            label={'Output frames'}
            checked={shouldOutputFrames}
            onChange={onShouldUpdateFramesChange}
          />
          <InfoBox
            text={`If checked, the specified number of frames will be recorded as
                screenshots and saved to disk. Per default, they are saved in the
                user/screenshots folder. This feature can not be used together with
                'loop playback'`}
          />
          {shouldOutputFrames && (
            <TextInput
              value={outputFramerate}
              placeholder={'framerate'}
              aria-label={'set framerate'}
              onChange={(event) =>
                setOutputFramerate(parseInt(event.currentTarget.value, 10))
              }
              height={22}
              w={120}
            />
          )}
        </Group>
        <Group gap={'xs'} align={'flex-end'}>
          <Select
            value={filenamePlayback}
            label={'Playback file'}
            placeholder={'Select playback file'}
            data={fileList}
            onChange={setFilenamePlayback}
          />
          <Button
            onClick={togglePlayback}
            leftSection={playbackButtonProps.icon}
            disabled={!filenamePlayback}
            color={playbackButtonProps.color}
          >
            {playbackButtonProps.text}
          </Button>
        </Group>
      </Stack>
    </>
  );
}
