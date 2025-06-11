import { useTranslation } from 'react-i18next';
import { Button, ButtonProps } from '@mantine/core';

import { useOpenSpaceApi } from '@/api/hooks';
import { PauseIcon } from '@/icons/icons';

export function PlaybackPauseButton({ ...props }: ButtonProps) {
  const luaApi = useOpenSpaceApi();
  const { t } = useTranslation('panel-sessionrecording', { keyPrefix: 'button-labels' });

  return (
    <Button
      onClick={() => luaApi?.sessionRecording.togglePlaybackPause()}
      leftSection={<PauseIcon />}
      variant={'filled'}
      {...props}
    >
      {t('pause')}
    </Button>
  );
}
