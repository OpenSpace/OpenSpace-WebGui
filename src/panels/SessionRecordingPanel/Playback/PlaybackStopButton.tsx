import { useTranslation } from 'react-i18next';
import { Button, ButtonProps } from '@mantine/core';

import { useOpenSpaceApi } from '@/api/hooks';
import { StopIcon } from '@/icons/icons';

export function PlaybackStopButton({ ...props }: ButtonProps) {
  const luaApi = useOpenSpaceApi();
  const { t } = useTranslation('sessionrecording');

  return (
    <Button
      onClick={() => luaApi?.sessionRecording.stopPlayback()}
      leftSection={<StopIcon />}
      color={'red'}
      variant={'filled'}
      {...props}
    >
      {t('stop-playback')}
    </Button>
  );
}
