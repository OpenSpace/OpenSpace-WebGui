import { useEffect, useMemo, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import {
  Alert,
  CheckIcon,
  Group,
  Select,
  SelectProps,
  Stack,
  Text,
  Title
} from '@mantine/core';

import { BoolInput } from '@/components/Input/BoolInput';
import { NumericInput } from '@/components/Input/NumericInput/NumericInput';
import { useSubscribeToSessionRecording } from '@/hooks/topicSubscriptions';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { updateSessionRecordingSettings } from '@/redux/sessionrecording/sessionRecordingSlice';

import { KeybindButtons } from '../KeybindsPanel/KeybindButtons';

import { PlaybackPauseButton } from './Playback/PlaybackPauseButton';
import { PlaybackPlayButton } from './Playback/PlaybackPlayButton';
import { PlaybackResumeButton } from './Playback/PlaybackResumeButton';
import { PlaybackStopButton } from './Playback/PlaybackStopButton';
import { RecordingState } from './types';
import { parseFilename } from './util';

export function PlaySession() {
  const { t } = useTranslation('panel-sessionrecording', { keyPrefix: 'play-session' });

  const [loopPlayback, setLoopPlayback] = useState(false);
  const [shouldOutputFrames, setShouldOutputFrames] = useState(false);
  const [outputFramerate, setOutputFramerate] = useState(60);
  const { latestFile, hideGuiOnPlayback, hideDashboardsOnPlayback } = useAppSelector(
    (state) => state.sessionRecording.settings
  );
  const [playbackFile, setPlaybackFile] = useState<string | null>(latestFile);
  const keybinds = useAppSelector((state) => state.actions.keybinds);

  const fileList = useAppSelector((state) => state.sessionRecording.files);
  const recordingState = useSubscribeToSessionRecording();
  const dispatch = useAppDispatch();

  const isIdle = recordingState === RecordingState.Idle;
  const isPlayingBack =
    recordingState === RecordingState.Paused || recordingState === RecordingState.Playing;

  const isSettingsCombinationDangerous = loopPlayback && hideGuiOnPlayback;
  const toggleGuiKeybind = keybinds.find(
    (keybind) => keybind.action === 'os.ToggleMainGui'
  );

  // Update the playback dropdown list to the latest recorded file
  useEffect(() => {
    if (latestFile) {
      setPlaybackFile(latestFile);
    }
  }, [latestFile]);

  // Store file duplicates in map for quick lookup
  const fileCounts = useMemo(() => {
    const map = new Map<string, number>();
    fileList.forEach((file) => {
      const name = file.substring(0, file.lastIndexOf('.'));
      map.set(name, (map.get(name) || 0) + 1);
    });

    return map;
  }, [fileList]);

  const fileListSelectData = useMemo(() => {
    return fileList.map((file) => {
      const { filename, isFileDuplicate } = parseFilename(file, fileCounts);
      const label = isFileDuplicate ? file : filename;

      return { value: file, label: label };
    });
  }, [fileList, fileCounts]);

  const renderSelectOption: SelectProps['renderOption'] = ({ option, checked }) => {
    const file = option.value;
    const { filename, extension, isFileDuplicate } = parseFilename(file, fileCounts);

    return (
      <Group gap={'xs'}>
        {checked && <CheckIcon size={12} color={'gray'} />}
        <Text size={'sm'}>
          {filename}
          {isFileDuplicate && (
            <Text c={'dimmed'} size={'xs'} span>
              {extension}
            </Text>
          )}
        </Text>
      </Group>
    );
  };

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
        Play
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
            info={t('output-frames.tooltip')}
          />
          <NumericInput
            value={outputFramerate}
            placeholder={t('framerate.placeholder')}
            aria-label={t('framerate.aria-label')}
            onEnter={(value) => setOutputFramerate(value)}
            w={80}
            disabled={!shouldOutputFrames || !isIdle}
          />
        </Group>
        <BoolInput
          label={t('hide-gui-on-playback.label')}
          value={hideGuiOnPlayback}
          onChange={(value) =>
            dispatch(updateSessionRecordingSettings({ hideGuiOnPlayback: value }))
          }
          info={t('hide-gui-on-playback.tooltip')}
          disabled={isPlayingBack}
        />
        {isSettingsCombinationDangerous && (
          <Alert
            variant={'light'}
            color={'orange'}
            title={t('settings-combination-warning.title')}
          >
            <Text>
              <Trans
                t={t}
                i18nKey={'settings-combination-warning.description'}
                components={{
                  keybind: (
                    <KeybindButtons
                      selectedKey={toggleGuiKeybind?.key}
                      modifiers={toggleGuiKeybind?.modifiers}
                    />
                  ),
                  italic: <Text fs={'italic'} span inherit />
                }}
              />
            </Text>
          </Alert>
        )}
        <BoolInput
          label={t('hide-dashboards-on-playback.label')}
          value={hideDashboardsOnPlayback}
          onChange={(value) =>
            dispatch(updateSessionRecordingSettings({ hideDashboardsOnPlayback: value }))
          }
          info={t('hide-dashboards-on-playback.tooltip')}
          disabled={isPlayingBack}
        />
        <Group gap={'xs'} align={'flex-end'}>
          <Select
            value={playbackFile}
            label={t('playback-file.label')}
            placeholder={t('playback-file.placeholder')}
            data={fileListSelectData}
            renderOption={renderSelectOption}
            onChange={setPlaybackFile}
            searchable
            disabled={!isIdle}
          />
          <PlaybackPlayButton
            disabled={isPlayingBack || !playbackFile}
            filename={playbackFile}
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
