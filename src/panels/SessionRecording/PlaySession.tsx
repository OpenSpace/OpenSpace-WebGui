import { useState } from 'react';
import { Checkbox, Group, Select, Stack, Title } from '@mantine/core';

import { useOpenSpaceApi, useSubscribeToSessionRecording } from '@/api/hooks';
import { InfoBox } from '@/components/InfoBox/InfoBox';
import { NumericInput } from '@/components/Input/NumericInput/NumericInput';
import { useAppSelector } from '@/redux/hooks';
import { RecordingsFolderKey } from '@/util/keys';

import { PausePlaybackButton } from './Buttons/PausePlaybackButton';
import { PlayPlaybackButton } from './Buttons/PlayPlaybackButton';
import { ResumePlaybackButton } from './Buttons/ResumePlaybackButton';
import { StopPlaybackButton } from './Buttons/StopPlaybackButton';
import { RecordingState } from './types';

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

  function isPlaybackState(): boolean {
    return (
      recordingState === RecordingState.Paused ||
      recordingState === RecordingState.Playing
    );
  }

  async function startPlayback(): Promise<void> {
    const shouldWaitForTiles = true;
    const filePath = await luaApi?.absPath(`${RecordingsFolderKey}${filenamePlayback}`);
    if (!filePath) {
      return; // TODO anden88 2025-02-18: notification about error using mantine notification system?
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

  return (
    <>
      <Title order={2}>Play Session</Title>
      <Stack gap={'xs'}>
        <Checkbox
          label={'Loop playback'}
          checked={loopPlayback}
          onChange={onLoopPlaybackChange}
          disabled={!isIdle()}
        />
        <Group>
          <Checkbox
            label={'Output frames'}
            checked={shouldOutputFrames}
            onChange={onShouldUpdateFramesChange}
            disabled={!isIdle()}
          />
          <InfoBox
            text={`If checked, the specified number of frames will be recorded as
                screenshots and saved to disk. Per default, they are saved in the
                user/screenshots folder. This feature can not be used together with
                'loop playback'`}
          />
          {shouldOutputFrames && (
            <NumericInput
              value={outputFramerate}
              placeholder={'Framerate'}
              aria-label={'Set framerate'}
              onEnter={(value) => setOutputFramerate(value)}
              w={80}
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
            searchable
          />
          {isPlaybackState() && (
            <>
              {recordingState === RecordingState.Paused ? (
                <ResumePlaybackButton />
              ) : (
                <PausePlaybackButton />
              )}
            </>
          )}
          {isPlaybackState() ? (
            <StopPlaybackButton />
          ) : (
            <PlayPlaybackButton onClick={startPlayback} />
          )}
        </Group>
      </Stack>
    </>
  );
}
