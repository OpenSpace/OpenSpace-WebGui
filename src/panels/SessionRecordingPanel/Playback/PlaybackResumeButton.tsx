import { useTranslation } from 'react-i18next';
import { Button, ButtonProps } from '@mantine/core';

import { useOpenSpaceApi } from '@/api/hooks';
import { PlayIcon } from '@/icons/icons';

export function PlaybackResumeButton({ ...props }: ButtonProps) {
  const { t } = useTranslation('panel-sessionrecording', { keyPrefix: 'button-labels' });

  const luaApi = useOpenSpaceApi();

  return (
    <Button
      onClick={() => luaApi?.sessionRecording.togglePlaybackPause()}
      leftSection={<PlayIcon />}
      color={'orange'}
      variant={'filled'}
      {...props}
    >
      {t('resume')}
    </Button>
  );
}
