import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Stack, Textarea } from '@mantine/core';

import { TestCommand } from '../types';

import { AddCommandButton } from './AddCommandButton';

interface Props {
  onAdd: (command: TestCommand) => void;
}

export function ScriptCommand({ onAdd }: Props) {
  const { t } = useTranslation('panel-testwizard', { keyPrefix: 'add-command-form' });

  const [script, setScript] = useState('');

  return (
    <Stack gap={'sm'}>
      <Textarea
        label={t('script.label')}
        placeholder={t('script.placeholder')}
        value={script}
        onChange={(event) => setScript(event.currentTarget.value)}
        autosize
        minRows={2}
      />
      <AddCommandButton
        onClick={() => onAdd({ type: 'script', value: script })}
        disabled={!script}
      />
    </Stack>
  );
}
