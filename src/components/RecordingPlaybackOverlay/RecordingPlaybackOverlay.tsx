import { LoadingOverlay, Stack, Text, ThemeIcon } from '@mantine/core';

import { VideocamIcon } from '@/icons/icons';
import { useAppSelector } from '@/redux/hooks';
import styles from '@/theme/global.module.css';
import { EngineMode, IconSize } from '@/types/enums';

interface Props {
  text?: string;
}

export function RecordingPlaybackOverlay({ text }: Props) {
  const engineMode = useAppSelector((state) => state.engineMode.mode);

  const isPlayingBackSessionRecording =
    engineMode === EngineMode.SessionRecordingPlayback;

  return (
    <LoadingOverlay
      visible={isPlayingBackSessionRecording}
      overlayProps={{ blur: 5 }}
      loaderProps={{
        children: (
          <Stack justify={'center'} align={'center'} gap={'xs'}>
            <ThemeIcon size={'xl'} className={styles.blinking}>
              <VideocamIcon size={IconSize.lg} />
            </ThemeIcon>
            {text && (
              <Text ta={'center'} p={'lg'}>
                {text}
              </Text>
            )}
          </Stack>
        )
      }}
    />
  );
}
