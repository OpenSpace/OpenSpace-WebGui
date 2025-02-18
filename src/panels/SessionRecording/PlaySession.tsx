import { useState } from 'react';
import { Checkbox, Group, Select, Stack, Title } from '@mantine/core';

import { useSubscribeToSessionRecording } from '@/api/hooks';
import { InfoBox } from '@/components/InfoBox/InfoBox';
import { NumericInput } from '@/components/Input/NumericInput/NumericInput';
import { useAppSelector } from '@/redux/hooks';

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

  const isIdle = recordingState === RecordingState.Idle;
  const isPlayingBack =
    recordingState === RecordingState.Paused || recordingState === RecordingState.Playing;

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

  return (
    <>
      <Title order={2} my={'xs'}>
        Play
      </Title>
      <Stack gap={'xs'}>
        <Checkbox
          label={'Loop playback'}
          checked={loopPlayback}
          onChange={onLoopPlaybackChange}
          disabled={!isIdle}
        />
        <Group>
          <Checkbox
            label={'Output frames'}
            checked={shouldOutputFrames}
            onChange={onShouldUpdateFramesChange}
            disabled={!isIdle}
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
            disabled={isPlayingBack}
          />
          <PlayPlaybackButton
            disabled={isPlayingBack || filenamePlayback === null}
            filename={filenamePlayback}
            loopPlayback={loopPlayback}
            shouldOutputFrames={shouldOutputFrames}
            outputFramerate={outputFramerate}
          />
        </Group>
        <Group gap={'xs'}>
          {recordingState === RecordingState.Paused && <ResumePlaybackButton />}
          {recordingState === RecordingState.Playing && <PausePlaybackButton />}
          {isPlayingBack && <StopPlaybackButton />}
        </Group>
      </Stack>
    </>
  );
}
