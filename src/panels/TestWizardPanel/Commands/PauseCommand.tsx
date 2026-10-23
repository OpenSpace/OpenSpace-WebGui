import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Stack, Switch } from '@mantine/core';

import { TestCommand } from '../types';

import { AddCommandButton } from './AddCommandButton';

interface Props {
  onAdd: (command: TestCommand) => void;
}

export function PauseCommand({ onAdd }: Props) {
  const { t } = useTranslation('panel-testwizard', { keyPrefix: 'add-command-form' });

  const [isPaused, setIsPaused] = useState(true);

  return (
    <Stack gap={'sm'}>
      <Switch
        label={t('pause')}
        checked={isPaused}
        onChange={(e) => setIsPaused(e.currentTarget.checked)}
      />
      <AddCommandButton onClick={() => onAdd({ type: 'pause', value: isPaused })} />
    </Stack>
  );
}
