import { useEffect, useMemo, useState } from 'react';
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
import { useSubscribeToProperty } from '@/hooks/properties';
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

  // Subscribe to Properties so that the middleware will be notified on updated values
  // Important! These properties have to be kept in sync with the properties used in the
  // middleware
  useSubscribeToProperty('Modules.CefWebGui.Visible');
  useSubscribeToProperty('RenderEngine.ShowLog');
  useSubscribeToProperty('RenderEngine.ShowVersion');
  useSubscribeToProperty('Dashboard.IsEnabled');

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
          label={'Loop playback'}
          value={loopPlayback}
          onChange={onLoopPlaybackChange}
          disabled={!isIdle}
        />
        <Group>
          <BoolInput
            label={'Output frames'}
            value={shouldOutputFrames}
            onChange={onShouldUpdateFramesChange}
            disabled={!isIdle}
            info={`If checked, the specified number of frames will be recorded as
              screenshots and saved to disk. Per default, they are saved in the
              user/screenshots folder. This feature can not be used together with
              'Loop playback'`}
          />
          <NumericInput
            value={outputFramerate}
            placeholder={'Framerate'}
            aria-label={'Set framerate'}
            onEnter={(value) => setOutputFramerate(value)}
            w={80}
            disabled={!shouldOutputFrames || !isIdle}
          />
        </Group>
        <BoolInput
          label={'Hide GUI on playback'}
          value={hideGuiOnPlayback}
          onChange={(value) =>
            dispatch(updateSessionRecordingSettings({ hideGuiOnPlayback: value }))
          }
          info={
            'When checked, hides the GUI during playback. It will reappear after the recording ends.'
          }
          disabled={isPlayingBack}
        />
        {isSettingsCombinationDangerous && (
          <Alert variant={'light'} color={'orange'} title={'Warning'}>
            <Text mb={'xs'}>
              Caution: Enabling both{' '}
              <Text fs={'italic'} span inherit>
                Loop playback
              </Text>{' '}
              and{' '}
              <Text fs={'italic'} span inherit>
                Hide GUI
              </Text>{' '}
              will cause the interface to remain hidden indefinitely during playback. To
              reveal the GUI again, press:
            </Text>
            <KeybindButtons
              selectedKey={toggleGuiKeybind?.key}
              modifiers={toggleGuiKeybind?.modifiers}
            />
          </Alert>
        )}
        <BoolInput
          label={'Hide dashboards on playback'}
          value={hideDashboardsOnPlayback}
          onChange={(value) =>
            dispatch(updateSessionRecordingSettings({ hideDashboardsOnPlayback: value }))
          }
          info={
            'When checked, hides the dashboard overlays during playback. They will reappear after the recording ends.'
          }
          disabled={isPlayingBack}
        />
        <Group gap={'xs'} align={'flex-end'}>
          <Select
            value={playbackFile}
            label={'Playback file'}
            placeholder={'Select playback file'}
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
