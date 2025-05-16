import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Group, Select, Stack, Title } from '@mantine/core';

import { BoolInput } from '@/components/Input/BoolInput';
import { NumericInput } from '@/components/Input/NumericInput/NumericInput';
import { useSubscribeToSessionRecording } from '@/hooks/topicSubscriptions';
import { useAppSelector } from '@/redux/hooks';

import { PlaybackPauseButton } from './Playback/PlaybackPauseButton';
import { PlaybackPlayButton } from './Playback/PlaybackPlayButton';
import { PlaybackResumeButton } from './Playback/PlaybackResumeButton';
import { PlaybackStopButton } from './Playback/PlaybackStopButton';
import { RecordingState } from './types';

export function PlaySession() {
  const [loopPlayback, setLoopPlayback] = useState(false);
  const [shouldOutputFrames, setShouldOutputFrames] = useState(false);
  const [outputFramerate, setOutputFramerate] = useState(60);
  const [filenamePlayback, setFilenamePlayback] = useState<string | null>(null);

  const fileList = useAppSelector((state) => state.sessionRecording.files);
  const recordingState = useSubscribeToSessionRecording();
  const { t } = useTranslation(['sessionrecording', 'common'], {
    keyPrefix: 'play-session'
  });

  const isIdle = recordingState === RecordingState.Idle;
  const isPlayingBack =
    recordingState === RecordingState.Paused || recordingState === RecordingState.Playing;

  function onLoopPlaybackChange(shouldLoop: boolean): void {
    if (shouldLoop) {
      setLoopPlayback(true);
      setShouldOutputFrames(false);
    } else {
      setLoopPlayback(false);
    }
  }

  function onShouldUpdateFramesChange(shouldOutputFrames: boolean): void {
    if (shouldOutputFrames) {
      setShouldOutputFrames(true);
      setLoopPlayback(false);
    } else {
      setShouldOutputFrames(false);
    }
  }

  return (
    <>
      <Title order={2} my={'xs'}>
        {t('common:play')}
      </Title>
      <Stack gap={'xs'}>
        <BoolInput
          label={t('loop-playback-label')}
          value={loopPlayback}
          onChange={onLoopPlaybackChange}
          disabled={!isIdle}
        />
        <Group>
          <BoolInput
            label={t('output-frames.label')}
            value={shouldOutputFrames}
            onChange={onShouldUpdateFramesChange}
            disabled={!isIdle}
            info={t('output-frames.info')}
          />
          <NumericInput
            value={outputFramerate}
            placeholder={t('output-frames.framerate-placeholder')}
            aria-label={t('output-frames.framerate-aria-label')}
            onEnter={(value) => setOutputFramerate(value)}
            w={80}
            disabled={!shouldOutputFrames || !isIdle}
          />
        </Group>
        <Group gap={'xs'} align={'flex-end'}>
          <Select
            value={filenamePlayback}
            label={t('playback-file.label')}
            placeholder={t('playback-file.placeholder')}
            data={fileList}
            onChange={setFilenamePlayback}
            searchable
            disabled={isPlayingBack}
          />
          <PlaybackPlayButton
            disabled={isPlayingBack || filenamePlayback === null}
            filename={filenamePlayback}
            loopPlayback={loopPlayback}
            shouldOutputFrames={shouldOutputFrames}
            outputFramerate={outputFramerate}
          />
        </Group>
        <Group gap={'xs'}>
          {recordingState === RecordingState.Paused && <PlaybackResumeButton />}
          {recordingState === RecordingState.Playing && <PlaybackPauseButton />}
          {isPlayingBack && <PlaybackStopButton />}
        </Group>
      </Stack>
    </>
  );
}
